const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function addSampleTravelRequests() {
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
    const collection = db.collection('travel_requests');
    
    // First get a list of users to associate travel requests with
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log("No users found. Please add users first.");
      return;
    }

    // Common locations in Bangalore
    const locations = [
      { 
        address: "Indiranagar, Bangalore", 
        latitude: 12.9784, 
        longitude: 77.6408,
        name: "Indiranagar"
      },
      { 
        address: "Koramangala, Bangalore", 
        latitude: 12.9352, 
        longitude: 77.6245,
        name: "Koramangala"
      },
      { 
        address: "Whitefield, Bangalore", 
        latitude: 12.9698, 
        longitude: 77.7500,
        name: "Whitefield"
      },
      { 
        address: "Electronic City, Bangalore", 
        latitude: 12.8399, 
        longitude: 77.6770,
        name: "Electronic City"
      },
      { 
        address: "MG Road, Bangalore", 
        latitude: 12.9756, 
        longitude: 77.6080,
        name: "MG Road"
      },
      { 
        address: "Hebbal, Bangalore", 
        latitude: 13.0385, 
        longitude: 77.5963,
        name: "Hebbal"
      },
      { 
        address: "Jayanagar, Bangalore", 
        latitude: 12.9250, 
        longitude: 77.5938,
        name: "Jayanagar"
      },
      { 
        address: "HSR Layout, Bangalore", 
        latitude: 12.9116, 
        longitude: 77.6474,
        name: "HSR Layout"
      },
      { 
        address: "BTM Layout, Bangalore", 
        latitude: 12.9166, 
        longitude: 77.6101,
        name: "BTM Layout"
      },
      { 
        address: "Yelahanka, Bangalore", 
        latitude: 13.1005, 
        longitude: 77.5963,
        name: "Yelahanka"
      }
    ];
    
    const travelModes = ["car", "bus", "train", "walk", "bike"];
    const statuses = ["active", "completed", "cancelled"];
    
    const requests = [];
    
    // Create travel requests
    for (let i = 0; i < 30; i++) {
      const user = users[i % users.length];
      const userId = user._id.toString();
      
      // Randomly select from and to locations (ensure they're different)
      const fromIndex = Math.floor(Math.random() * locations.length);
      let toIndex = Math.floor(Math.random() * locations.length);
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * locations.length);
      }
      
      // Random date within the next month
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + Math.floor(Math.random() * 30));
      
      // Random time
      const hour = Math.floor(7 + Math.random() * 14);  // Between 7 AM and 9 PM
      const minute = Math.floor(Math.random() * 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      const travelMode = travelModes[Math.floor(Math.random() * travelModes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      requests.push({
        userId: userId,
        fromLocation: locations[fromIndex],
        toLocation: locations[toIndex],
        date: future,
        time: timeStr,
        travelMode,
        seats: Math.floor(1 + Math.random() * 3),
        price: Math.floor(100 + Math.random() * 400),
        notes: `Travel request from ${locations[fromIndex].name} to ${locations[toIndex].name}`,
        status,
        createdAt: today,
        updatedAt: today,
        preferences: {
          womenOnly: Math.random() > 0.5,
          noSmoking: Math.random() > 0.3,
          noPets: Math.random() > 0.7,
          quietRide: Math.random() > 0.6,
          luggageSpace: Math.random() > 0.5,
          maxPassengers: Math.floor(1 + Math.random() * 4)
        }
      });
    }
    
    // Insert the travel requests
    const result = await collection.insertMany(requests);
    
    console.log(`${result.insertedCount} travel requests added`);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
addSampleTravelRequests()
  .then(() => console.log("Sample travel requests added successfully"))
  .catch(console.error)
  .finally(() => process.exit()); 