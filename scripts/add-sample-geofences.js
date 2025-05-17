const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function addSampleGeofences() {
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
    const collection = db.collection('geofencing');
    
    // First get a list of users to associate geofences with
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log("No users found. Please add users first.");
      return;
    }
    
    // Generate sample geofences
    const geofences = [];
    
    // Safe zones (circular)
    const safeLocationCenters = [
      { name: "Home Safe Zone", lat: 12.9784, lng: 77.6408 },
      { name: "Work Safe Zone", lat: 12.9352, lng: 77.6245 },
      { name: "University Campus", lat: 13.0230, lng: 77.5679 },
      { name: "Shopping Mall", lat: 12.9716, lng: 77.6082 },
      { name: "Hospital Zone", lat: 12.9590, lng: 77.6121 },
      { name: "Gym Area", lat: 12.9650, lng: 77.5800 },
      { name: "Friend's Neighborhood", lat: 12.9802, lng: 77.6909 },
      { name: "Library Zone", lat: 12.9700, lng: 77.5900 },
      { name: "Community Center", lat: 13.0159, lng: 77.5698 },
      { name: "Park Area", lat: 12.9550, lng: 77.6042 }
    ];
    
    // Danger zones (circular)
    const dangerLocationCenters = [
      { name: "Isolated Area", lat: 12.9630, lng: 77.5850 },
      { name: "Construction Site", lat: 13.0120, lng: 77.5840 },
      { name: "Abandoned Building", lat: 12.9500, lng: 77.6200 },
      { name: "Dark Alley Section", lat: 12.9760, lng: 77.6020 },
      { name: "Poorly Lit Street", lat: 12.9690, lng: 77.5960 },
      { name: "Railroad Crossing", lat: 12.9830, lng: 77.5770 },
      { name: "Industrial Zone", lat: 13.0020, lng: 77.6100 },
      { name: "Accident-Prone Area", lat: 12.9450, lng: 77.5920 },
      { name: "Crime Reported Location", lat: 12.9650, lng: 77.6240 },
      { name: "Unmonitored Pathway", lat: 12.9720, lng: 77.6130 }
    ];
    
    // Caution zones (circular)
    const cautionLocationCenters = [
      { name: "Busy Intersection", lat: 12.9770, lng: 77.5980 },
      { name: "Evening Market", lat: 12.9550, lng: 77.6150 },
      { name: "Bus Terminal", lat: 12.9780, lng: 77.6270 },
      { name: "Train Station Area", lat: 12.9680, lng: 77.5800 },
      { name: "College Exit", lat: 12.9850, lng: 77.6030 },
      { name: "Bar District", lat: 12.9600, lng: 77.6050 },
      { name: "Tourist Spot", lat: 12.9710, lng: 77.5920 },
      { name: "Stadium Exit", lat: 13.0050, lng: 77.5950 },
      { name: "Temple Festival Area", lat: 12.9530, lng: 77.5880 },
      { name: "ATM Cluster", lat: 12.9675, lng: 77.6075 }
    ];

    // Add safe zones
    safeLocationCenters.forEach((center, index) => {
      const user = users[index % users.length];
      const radius = 0.2 + Math.random() * 0.5; // Between 0.2 and 0.7 km
      
      geofences.push({
        name: center.name,
        type: "safe",
        points: [{ latitude: center.lat, longitude: center.lng }],
        radius: radius,
        metadata: {
          description: `Safe zone around ${center.name}`,
          createdBy: user._id.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          color: "#10b981", // green
          icon: "shield"
        }
      });
    });
    
    // Add danger zones
    dangerLocationCenters.forEach((center, index) => {
      const user = users[(index + 10) % users.length];
      const radius = 0.1 + Math.random() * 0.4; // Between 0.1 and 0.5 km
      
      geofences.push({
        name: center.name,
        type: "danger",
        points: [{ latitude: center.lat, longitude: center.lng }],
        radius: radius,
        metadata: {
          description: `Danger zone around ${center.name}`,
          createdBy: user._id.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          color: "#ef4444", // red
          icon: "alert-triangle"
        }
      });
    });
    
    // Add caution zones
    cautionLocationCenters.forEach((center, index) => {
      const user = users[(index + 20) % users.length];
      const radius = 0.15 + Math.random() * 0.35; // Between 0.15 and 0.5 km
      
      geofences.push({
        name: center.name,
        type: "caution",
        points: [{ latitude: center.lat, longitude: center.lng }],
        radius: radius,
        metadata: {
          description: `Caution zone around ${center.name}`,
          createdBy: user._id.toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          color: "#f59e0b", // amber
          icon: "alert-circle"
        }
      });
    });
    
    // Insert the geofences
    const result = await collection.insertMany(geofences);
    
    console.log(`${result.insertedCount} geofences added`);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
addSampleGeofences()
  .then(() => console.log("Sample geofences added successfully"))
  .catch(console.error)
  .finally(() => process.exit()); 