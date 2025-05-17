const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function cleanCollections() {
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
    
    // Collections to clean
    const collections = [
      'users',
      'emergency_contacts',
      'travel_requests',
      'threat_locations',
      'notifications',
      'geofencing'
    ];
    
    // Delete all documents from each collection
    for (const collectionName of collections) {
      const result = await db.collection(collectionName).deleteMany({});
      console.log(`Cleaned ${result.deletedCount} documents from ${collectionName}`);
    }
    
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
cleanCollections()
  .then(() => console.log("All collections cleaned successfully"))
  .catch(console.error)
  .finally(() => process.exit());