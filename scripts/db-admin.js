const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  TRAVEL_REQUESTS: 'travel_requests',
  THREAT_LOCATIONS: 'threat_locations',
  NOTIFICATIONS: 'notifications'
};

// Available databases
const DATABASES = ['sakha', 'sakha_app', 'sakha_db'];

async function main() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully!');

    // Process command line arguments
    const command = process.argv[2];
    const param1 = process.argv[3];
    const param2 = process.argv[4];

    switch (command) {
      case 'list-dbs':
        await listDatabases(client);
        break;
      case 'list-collections':
        await listCollections(client, param1);
        break;
      case 'count-docs':
        await countDocuments(client, param1, param2);
        break;
      case 'create-db':
        await createDatabase(client, param1);
        break;
      case 'drop-db':
        await dropDatabase(client, param1);
        break;
      case 'create-collections':
        await createCollections(client, param1);
        break;
      case 'clear-collection':
        await clearCollection(client, param1, param2);
        break;
      case 'create-indexes':
        await createIndexes(client, param1);
        break;
      default:
        showUsage();
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

// Show usage instructions
function showUsage() {
  console.log('Available commands:');
  console.log('  list-dbs - List all databases');
  console.log('  list-collections <database> - List collections in a database');
  console.log('  count-docs <database> <collection> - Count documents in a collection');
  console.log('  create-db <database> - Create a new database with default collections');
  console.log('  drop-db <database> - Drop a database');
  console.log('  create-collections <database> - Create default collections in a database');
  console.log('  clear-collection <database> <collection> - Clear a collection');
  console.log('  create-indexes <database> - Create indexes in collections');
}

// List all databases
async function listDatabases(client) {
  console.log('Available databases:');
  const dbList = await client.db().admin().listDatabases();
  dbList.databases.forEach(db => {
    const size = (db.sizeOnDisk / 1024 / 1024).toFixed(2);
    console.log(` - ${db.name} (${size} MB)`);
  });
}

// List collections in a database
async function listCollections(client, database) {
  if (!database) {
    console.error('Error: Database name is required');
    return;
  }

  try {
    const db = client.db(database);
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log(`No collections found in database: ${database}`);
      return;
    }

    console.log(`Collections in database ${database}:`);
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(` - ${collection.name} (${count} documents)`);
    }
  } catch (error) {
    console.error(`Error listing collections in ${database}:`, error);
  }
}

// Count documents in a collection
async function countDocuments(client, database, collection) {
  if (!database || !collection) {
    console.error('Error: Database and collection names are required');
    return;
  }

  try {
    const db = client.db(database);
    const count = await db.collection(collection).countDocuments();
    console.log(`Collection ${collection} in database ${database} has ${count} documents`);
  } catch (error) {
    console.error(`Error counting documents in ${database}.${collection}:`, error);
  }
}

// Create a new database with default collections
async function createDatabase(client, database) {
  if (!database) {
    console.error('Error: Database name is required');
    return;
  }

  try {
    // Create the database by creating a collection
    const db = client.db(database);
    
    // Create default collections
    await createCollections(client, database);
    
    console.log(`Database ${database} created successfully with default collections`);
  } catch (error) {
    console.error(`Error creating database ${database}:`, error);
  }
}

// Drop a database
async function dropDatabase(client, database) {
  if (!database) {
    console.error('Error: Database name is required');
    return;
  }

  try {
    await client.db(database).dropDatabase();
    console.log(`Database ${database} dropped successfully`);
  } catch (error) {
    console.error(`Error dropping database ${database}:`, error);
  }
}

// Create default collections in a database
async function createCollections(client, database) {
  if (!database) {
    console.error('Error: Database name is required');
    return;
  }

  try {
    const db = client.db(database);
    
    // Create each collection
    for (const collection of Object.values(COLLECTIONS)) {
      await db.createCollection(collection);
      console.log(`Created collection: ${collection}`);
    }
    
    console.log(`Default collections created in database ${database}`);
    
    // Create indexes after creating collections
    await createIndexes(client, database);
    
  } catch (error) {
    console.error(`Error creating collections in ${database}:`, error);
  }
}

// Clear a collection
async function clearCollection(client, database, collection) {
  if (!database || !collection) {
    console.error('Error: Database and collection names are required');
    return;
  }

  try {
    const db = client.db(database);
    await db.collection(collection).deleteMany({});
    console.log(`Collection ${collection} in database ${database} cleared successfully`);
  } catch (error) {
    console.error(`Error clearing collection ${database}.${collection}:`, error);
  }
}

// Create indexes in collections
async function createIndexes(client, database) {
  if (!database) {
    console.error('Error: Database name is required');
    return;
  }

  try {
    const db = client.db(database);
    
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
    
    console.log(`All indexes created in database ${database}`);
  } catch (error) {
    console.error(`Error creating indexes in ${database}:`, error);
  }
}

// Execute the script
main()
  .then(() => console.log('Script completed successfully!'))
  .catch(err => console.error('Script failed with error:', err))
  .finally(() => process.exit()); 