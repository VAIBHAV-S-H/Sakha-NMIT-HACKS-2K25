const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function addSampleThreatLocations() {
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
    const collection = db.collection('threat_locations');
    
    // Sample threat locations
    const threats = [
      {
        name: "Dark Alley",
        description: "Poorly lit area with few pedestrians",
        latitude: 12.9716,
        longitude: 77.5946,
        threatLevel: "high",
        reportedBy: "system",
        reportedAt: new Date(),
        verified: true,
        votes: 15,
        reportCount: 5,
        lastReportDate: new Date(),
        isActive: true
      },
      {
        name: "Market Corner",
        description: "Multiple theft incidents reported",
        latitude: 12.9780,
        longitude: 77.6080,
        threatLevel: "medium",
        reportedBy: "system",
        reportedAt: new Date(),
        verified: true,
        votes: 8,
        reportCount: 3,
        lastReportDate: new Date(),
        isActive: true
      },
      {
        name: "Bus Stop",
        description: "Harassment reported during evenings",
        latitude: 12.9650,
        longitude: 77.5880,
        threatLevel: "low",
        reportedBy: "system",
        reportedAt: new Date(),
        verified: true,
        votes: 4,
        reportCount: 2,
        lastReportDate: new Date(),
        isActive: true
      }
    ];
    
    // Insert the threats
    const result = await collection.insertMany(threats);
    
    console.log(`${result.insertedCount} threat locations added`);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
addSampleThreatLocations()
  .then(() => console.log("Sample threat locations added successfully"))
  .catch(console.error)
  .finally(() => process.exit());
