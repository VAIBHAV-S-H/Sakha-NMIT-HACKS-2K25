const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  TRAVEL_REQUESTS: 'travel_requests',
  THREAT_LOCATIONS: 'threat_locations',
  NOTIFICATIONS: 'notifications'
};

async function main() {
  console.log('=== SAKHA DATABASE SETUP SCRIPT ===');
  console.log('This script will set up the Sakha application database in MongoDB Atlas');
  console.log('-------------------------------------');
  
  try {
    // Create MongoDB client
    console.log('Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully!');
    
    // Step 1: Check database info
    console.log('\nStep 1: Checking database information...');
    const dbList = await client.db().admin().listDatabases();
    console.log('Available databases:');
    dbList.databases.forEach(db => {
      const size = (db.sizeOnDisk / 1024 / 1024).toFixed(2);
      console.log(` - ${db.name} (${size} MB)`);
    });
    
    // Step 2: Create the database and collections if they don't exist
    console.log('\nStep 2: Setting up database structure...');
    const db = client.db(databaseName);
    
    // Get existing collections
    const existingCollections = await db.listCollections().toArray();
    const existingCollectionNames = existingCollections.map(c => c.name);
    
    // Create collections if they don't exist
    for (const collectionName of Object.values(COLLECTIONS)) {
      if (!existingCollectionNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`Created collection: ${collectionName}`);
      } else {
        console.log(`Collection already exists: ${collectionName}`);
      }
    }
    
    // Step 3: Create indexes
    console.log('\nStep 3: Creating database indexes...');
    
    // Create user indexes
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
    await db.collection(COLLECTIONS.USERS).createIndex({ phone: 1 }, { unique: true });
    console.log(`Created indexes for ${COLLECTIONS.USERS}`);
    
    // Create emergency contacts indexes
    await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).createIndex({ userId: 1 });
    console.log(`Created indexes for ${COLLECTIONS.EMERGENCY_CONTACTS}`);
    
    // Create travel requests indexes
    await db.collection(COLLECTIONS.TRAVEL_REQUESTS).createIndex({ userId: 1 });
    await db.collection(COLLECTIONS.TRAVEL_REQUESTS).createIndex({ status: 1 });
    await db.collection(COLLECTIONS.TRAVEL_REQUESTS).createIndex({ startTime: 1 });
    console.log(`Created indexes for ${COLLECTIONS.TRAVEL_REQUESTS}`);
    
    // Create threat locations indexes
    await db.collection(COLLECTIONS.THREAT_LOCATIONS).createIndex({ userId: 1 });
    await db.collection(COLLECTIONS.THREAT_LOCATIONS).createIndex({ isActive: 1 });
    await db.collection(COLLECTIONS.THREAT_LOCATIONS).createIndex({ 'location.lat': 1, 'location.lng': 1 });
    console.log(`Created indexes for ${COLLECTIONS.THREAT_LOCATIONS}`);
    
    // Create notifications indexes
    await db.collection(COLLECTIONS.NOTIFICATIONS).createIndex({ userId: 1 });
    await db.collection(COLLECTIONS.NOTIFICATIONS).createIndex({ status: 1 });
    await db.collection(COLLECTIONS.NOTIFICATIONS).createIndex({ createdAt: -1 });
    console.log(`Created indexes for ${COLLECTIONS.NOTIFICATIONS}`);
    
    // Step 4: Execute the populate script
    console.log('\nStep 4: Populating the database with sample data...');
    console.log('Running populate-database.js script...');
    
    try {
      // This will close the current connection and open a new one in the populate script
      await client.close();
      
      // Run the populate script
      execSync('node scripts/populate-database.js', { stdio: 'inherit' });
      console.log('Database population completed successfully!');
    } catch (error) {
      console.error('Error running populate script:', error);
    }
    
    console.log('\nDatabase setup completed successfully!');
    console.log('\nYou can now use the fetch-data.js script to query data from the database:');
    console.log('  node scripts/fetch-data.js users');
    console.log('  node scripts/fetch-data.js threats');
    console.log('\nOr use db-admin.js for database administration:');
    console.log('  node scripts/db-admin.js list-collections sakha_app');
  } catch (error) {
    console.error('Error in database setup:', error);
  }
}

// Execute the script
main()
  .then(() => console.log('\nSetup completed!'))
  .catch(err => console.error('\nSetup failed with error:', err))
  .finally(() => process.exit()); 