const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function addSampleNotifications() {
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
    const collection = db.collection('notifications');
    
    // First get a list of users to send notifications to
    const users = await db.collection('users').find({}).toArray();
    
    if (users.length === 0) {
      console.log("No users found. Please add users first.");
      return;
    }
    
    // Get threat locations to reference in notifications
    const threatLocations = await db.collection('threat_locations').find({}).limit(10).toArray();
    
    // Get geofences to reference in notifications
    const geofences = await db.collection('geofencing').find({}).limit(10).toArray();
    
    // Common locations in Bangalore for notifications
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
      }
    ];
    
    // Generate sample notifications
    const notifications = [];
    
    // Threat notifications
    for (let i = 0; i < 10; i++) {
      const user = users[i % users.length];
      const threat = threatLocations[i % threatLocations.length] || {
        _id: "default_threat_id",
        name: "Unknown Threat",
        latitude: 12.9716,
        longitude: 77.5946
      };
      
      notifications.push({
        userId: user._id.toString(),
        type: "threat",
        message: `New threat reported near you: ${threat.name}`,
        status: i < 5 ? "unread" : "read",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Within last week
        relatedEntityId: threat._id.toString(),
        priority: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)],
        location: {
          address: locations[i % locations.length].address,
          latitude: threat.latitude || locations[i % locations.length].latitude,
          longitude: threat.longitude || locations[i % locations.length].longitude
        },
        actions: [
          {
            label: "View on Map",
            type: "navigate",
            data: { screen: "SafetyMap", params: { showThreat: threat._id.toString() } }
          },
          {
            label: "Dismiss",
            type: "dismiss"
          }
        ]
      });
    }
    
    // Geofence notifications
    for (let i = 0; i < 10; i++) {
      const user = users[(i + 10) % users.length];
      const geofence = geofences[i % geofences.length] || {
        _id: "default_geofence_id",
        name: "Unknown Area",
        type: "caution",
        points: [{ latitude: 12.9716, longitude: 77.5946 }]
      };
      
      const geofencePoint = geofence.points && geofence.points.length > 0 
        ? geofence.points[0] 
        : { latitude: 12.9716, longitude: 77.5946 };
      
      notifications.push({
        userId: user._id.toString(),
        type: "geofence",
        message: `You are entering a ${geofence.type} zone: ${geofence.name}`,
        status: i < 5 ? "unread" : "read",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)), // Within last 3 days
        relatedEntityId: geofence._id.toString(),
        priority: geofence.type === "danger" ? "high" : geofence.type === "caution" ? "medium" : "low",
        location: {
          address: locations[(i + 2) % locations.length].address,
          latitude: geofencePoint.latitude,
          longitude: geofencePoint.longitude
        },
        actions: [
          {
            label: "View Details",
            type: "navigate",
            data: { screen: "GeofenceDetail", params: { id: geofence._id.toString() } }
          },
          {
            label: "Dismiss",
            type: "dismiss"
          }
        ]
      });
    }
    
    // System notifications
    for (let i = 0; i < 10; i++) {
      const user = users[(i + 20) % users.length];
      
      notifications.push({
        userId: user._id.toString(),
        type: "system",
        message: [
          "Remember to share your travel plans with trusted contacts", 
          "Safety tip: Keep your phone charged when traveling",
          "New safety features are now available in the app",
          "Your emergency contacts have been synced",
          "Safety update: We've added new threat reports in your area",
          "Complete your safety profile to receive personalized alerts",
          "Your travel buddy request has been sent",
          "Safety tip: Always take well-lit routes at night",
          "App update available with improved safety features",
          "Weekly safety report is now available"
        ][i],
        status: i < 5 ? "unread" : "read",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)), // Within last 2 weeks
        priority: "medium",
        actions: [
          {
            label: "View",
            type: "navigate",
            data: { screen: "Settings" }
          },
          {
            label: "Dismiss",
            type: "dismiss"
          }
        ]
      });
    }
    
    // Insert the notifications
    const result = await collection.insertMany(notifications);
    
    console.log(`${result.insertedCount} notifications added`);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
addSampleNotifications()
  .then(() => console.log("Sample notifications added successfully"))
  .catch(console.error)
  .finally(() => process.exit()); 