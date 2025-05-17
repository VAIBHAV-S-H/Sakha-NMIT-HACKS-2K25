const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function addSampleEmergencyContacts() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    
    const db = client.db(databaseName);
    const collection = db.collection('emergency_contacts');
    
    // First get a list of users to associate contacts with
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log("No users found. Please add users first.");
      return;
    }
    
    const contacts = [];
    
    // Add 2-3 emergency contacts for each user
    for (let i = 0; i < 15; i++) {
      const user = users[i % users.length];
      const userId = user._id.toString();
      
      // Add family contact
      contacts.push({
        userId: userId,
        name: `Family of ${user.name.split(' ')[0]}`,
        phone: "+91" + Math.floor(9000000000 + Math.random() * 999999999),
        relationship: "Family",
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Add friend contact
      contacts.push({
        userId: userId,
        name: `Friend of ${user.name.split(' ')[0]}`,
        phone: "+91" + Math.floor(9000000000 + Math.random() * 999999999),
        relationship: "Friend",
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Add another contact for some users
      if (i % 3 === 0) {
        contacts.push({
          userId: userId,
          name: `Colleague of ${user.name.split(' ')[0]}`,
          phone: "+91" + Math.floor(9000000000 + Math.random() * 999999999),
          relationship: "Colleague",
          priority: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // Insert the emergency contacts
    const result = await collection.insertMany(contacts);
    
    console.log(`${result.insertedCount} emergency contacts added`);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
addSampleEmergencyContacts()
  .then(() => console.log("Sample emergency contacts added successfully"))
  .catch(console.error)
  .finally(() => process.exit()); 