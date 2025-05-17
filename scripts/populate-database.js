const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
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
  console.log('Starting database population script...');
  
  try {
    // Create MongoDB client
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
    
    // Get database
    const db = client.db(databaseName);
    console.log(`Using database: ${databaseName}`);
    
    // First clear all existing collections
    await clearCollections(db);
    
    // Read and populate data from JSON files
    const userIds = await populateUsers(db);
    await populateEmergencyContacts(db, userIds);
    await populateTravelRequests(db, userIds);
    await populateThreatLocations(db, userIds);
    await populateNotifications(db, userIds);
    
    // Close connection
    await client.close();
    console.log('Connection closed.');
    
    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error in database population:', error);
  }
}

async function clearCollections(db) {
  console.log('Clearing existing collections...');
  
  const collections = Object.values(COLLECTIONS);
  
  for (const collection of collections) {
    try {
      await db.collection(collection).deleteMany({});
      console.log(`- Cleared collection: ${collection}`);
    } catch (error) {
      console.warn(`  Warning: Could not clear collection ${collection}: ${error.message}`);
    }
  }
  
  console.log('Collections cleared.');
}

async function populateUsers(db) {
  console.log('Populating users...');
  
  // Read users data
  const usersData = readJsonFile('users.json');
  
  // Map of user ids
  const userIds = {};
  
  // Insert users with new ObjectIds
  for (const user of usersData) {
    // Convert date string to Date object
    if (user.dateOfBirth) {
      user.dateOfBirth = new Date(user.dateOfBirth);
    }
    
    // Add an identifier for reference
    const tempId = user.email.split('@')[0].toLowerCase();
    
    // Insert user
    const result = await db.collection(COLLECTIONS.USERS).insertOne(user);
    
    // Store mapping between temp id and MongoDB _id
    userIds[`user_${tempId}`] = result.insertedId.toString();
    
    console.log(`- Added user: ${user.name} (${user.email}) with ID: ${result.insertedId}`);
  }
  
  console.log(`Added ${usersData.length} users.`);
  return userIds;
}

async function populateEmergencyContacts(db, userIds) {
  console.log('Populating emergency contacts...');
  
  // Read emergency contacts data
  const contactsData = readJsonFile('emergency_contacts.json');
  
  // Update user IDs and insert contacts
  for (const contact of contactsData) {
    if (contact.userId && userIds[contact.userId]) {
      contact.userId = new ObjectId(userIds[contact.userId]);
      
      await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).insertOne(contact);
      console.log(`- Added emergency contact: ${contact.name} for user ID: ${contact.userId}`);
    } else {
      console.warn(`  Warning: Skipping contact ${contact.name} - User ID not found`);
    }
  }
  
  console.log(`Added ${contactsData.length} emergency contacts.`);
}

async function populateTravelRequests(db, userIds) {
  console.log('Populating travel requests...');
  
  // Read travel requests data
  const requestsData = readJsonFile('travel_requests.json');
  
  // Update user IDs and insert requests
  for (const request of requestsData) {
    if (request.userId && userIds[request.userId]) {
      request.userId = new ObjectId(userIds[request.userId]);
      
      // Convert date strings to Date objects
      if (request.startTime) request.startTime = new Date(request.startTime);
      if (request.estimatedEndTime) request.estimatedEndTime = new Date(request.estimatedEndTime);
      if (request.returnTime) request.returnTime = new Date(request.returnTime);
      
      await db.collection(COLLECTIONS.TRAVEL_REQUESTS).insertOne(request);
      console.log(`- Added travel request from ${request.startLocation.address} to ${request.endLocation.address}`);
    } else {
      console.warn(`  Warning: Skipping travel request - User ID not found`);
    }
  }
  
  console.log(`Added ${requestsData.length} travel requests.`);
}

async function populateThreatLocations(db, userIds) {
  console.log('Populating threat locations...');
  
  // Read threat locations data
  const locationsData = readJsonFile('threat_locations.json');
  
  // Update user IDs and insert threat locations
  for (const location of locationsData) {
    if (location.userId && userIds[location.userId]) {
      location.userId = new ObjectId(userIds[location.userId]);
      
      // Convert date string to Date object
      if (location.dateReported) location.dateReported = new Date(location.dateReported);
      
      await db.collection(COLLECTIONS.THREAT_LOCATIONS).insertOne(location);
      console.log(`- Added threat location: ${location.location.address} (${location.threatType})`);
    } else {
      console.warn(`  Warning: Skipping threat location - User ID not found`);
    }
  }
  
  console.log(`Added ${locationsData.length} threat locations.`);
}

async function populateNotifications(db, userIds) {
  console.log('Populating notifications...');
  
  // Read notifications data
  const notificationsData = readJsonFile('notifications.json');
  
  // Update user IDs and insert notifications
  for (const notification of notificationsData) {
    if (notification.userId && userIds[notification.userId]) {
      notification.userId = new ObjectId(userIds[notification.userId]);
      
      // Convert date strings to Date objects
      if (notification.createdAt) notification.createdAt = new Date(notification.createdAt);
      if (notification.readAt) notification.readAt = new Date(notification.readAt);
      
      await db.collection(COLLECTIONS.NOTIFICATIONS).insertOne(notification);
      console.log(`- Added notification: ${notification.title} for user ID: ${notification.userId}`);
    } else {
      console.warn(`  Warning: Skipping notification - User ID not found`);
    }
  }
  
  console.log(`Added ${notificationsData.length} notifications.`);
}

function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, '../data/json', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${filename}:`, error);
    return [];
  }
}

// Execute the script
main()
  .then(() => console.log('Script completed successfully!'))
  .catch(err => console.error('Script failed with error:', err))
  .finally(() => process.exit()); 