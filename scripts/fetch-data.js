const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

let client;
let db;

// Connect to MongoDB
async function connect() {
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('Connected to MongoDB Atlas successfully!');
    
    db = client.db(databaseName);
    console.log(`Using database: ${databaseName}`);
    
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Disconnect from MongoDB
async function disconnect() {
  if (client) {
    await client.close();
    console.log('Connection closed.');
  }
}

// Users Collection Functions
async function findAllUsers() {
  return await db.collection(COLLECTIONS.USERS).find({}).toArray();
}

async function findUserById(userId) {
  return await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(userId) });
}

async function findUserByEmail(email) {
  return await db.collection(COLLECTIONS.USERS).findOne({ email });
}

// Emergency Contacts Collection Functions
async function findEmergencyContactsByUserId(userId) {
  return await db.collection(COLLECTIONS.EMERGENCY_CONTACTS).find({ userId: new ObjectId(userId) }).toArray();
}

// Travel Requests Collection Functions
async function findAllTravelRequests() {
  return await db.collection(COLLECTIONS.TRAVEL_REQUESTS).find({}).toArray();
}

async function findPendingTravelRequests() {
  return await db.collection(COLLECTIONS.TRAVEL_REQUESTS).find({ status: 'pending' }).toArray();
}

async function findTravelRequestsByUserId(userId) {
  return await db.collection(COLLECTIONS.TRAVEL_REQUESTS).find({ userId: new ObjectId(userId) }).toArray();
}

async function findMatchingTravelRequests(startLocation, endLocation, startTimeRange) {
  // Calculate the distance between two locations
  function calculateDistance(loc1, loc2) {
    const lat1 = loc1.lat;
    const lng1 = loc1.lng;
    const lat2 = loc2.lat;
    const lng2 = loc2.lng;
    
    // Haversine formula for distance calculation
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    
    return distance;
  }
  
  // Find all pending or matched requests
  const allRequests = await db.collection(COLLECTIONS.TRAVEL_REQUESTS).find({
    status: { $in: ['pending', 'matched'] }
  }).toArray();
  
  // Filter by proximity and time
  const matches = [];
  const startTime = new Date(startTimeRange.start);
  const endTime = new Date(startTimeRange.end);
  
  for (const request of allRequests) {
    // Check start location proximity (within 2km)
    const startDistance = calculateDistance(startLocation, request.startLocation);
    if (startDistance > 2) continue;
    
    // Check end location proximity (within 2km)
    const endDistance = calculateDistance(endLocation, request.endLocation);
    if (endDistance > 2) continue;
    
    // Check time overlap
    const requestStartTime = new Date(request.startTime);
    if (requestStartTime < startTime || requestStartTime > endTime) continue;
    
    matches.push({
      ...request,
      startLocationDistance: startDistance.toFixed(2),
      endLocationDistance: endDistance.toFixed(2)
    });
  }
  
  return matches;
}

// Threat Locations Collection Functions
async function findAllThreatLocations() {
  return await db.collection(COLLECTIONS.THREAT_LOCATIONS).find({}).toArray();
}

async function findActiveThreatLocations() {
  return await db.collection(COLLECTIONS.THREAT_LOCATIONS).find({ isActive: true }).toArray();
}

async function findNearbyThreats(location, radiusKm) {
  // Find all active threat locations
  const allThreats = await findActiveThreatLocations();
  
  // Calculate the distance between two locations
  function calculateDistance(loc1, loc2) {
    const lat1 = loc1.lat;
    const lng1 = loc1.lng;
    const lat2 = loc2.lat;
    const lng2 = loc2.lng;
    
    // Haversine formula for distance calculation
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    
    return distance;
  }
  
  // Filter threats by distance
  const nearbyThreats = allThreats.filter(threat => {
    const distance = calculateDistance(location, threat.location);
    if (distance <= radiusKm) {
      // Add distance to the threat object
      return {
        ...threat,
        distance: distance.toFixed(2)
      };
    }
    return false;
  });
  
  return nearbyThreats;
}

// Notifications Collection Functions
async function findNotificationsByUserId(userId) {
  return await db.collection(COLLECTIONS.NOTIFICATIONS).find({ userId: new ObjectId(userId) }).toArray();
}

async function findUnreadNotificationsByUserId(userId) {
  return await db.collection(COLLECTIONS.NOTIFICATIONS).find({ 
    userId: new ObjectId(userId),
    status: 'unread'
  }).toArray();
}

// Example usage
async function main() {
  try {
    await connect();
    
    // Process command line arguments
    const command = process.argv[2];
    const param = process.argv[3];
    
    let result;
    
    switch (command) {
      case 'users':
        result = await findAllUsers();
        break;
      case 'user':
        result = await findUserByEmail(param);
        break;
      case 'contacts':
        result = await findEmergencyContactsByUserId(param);
        break;
      case 'travel-requests':
        result = await findTravelRequestsByUserId(param);
        break;
      case 'pending-requests':
        result = await findPendingTravelRequests();
        break;
      case 'threats':
        result = await findActiveThreatLocations();
        break;
      case 'notifications':
        result = await findNotificationsByUserId(param);
        break;
      case 'unread-notifications':
        result = await findUnreadNotificationsByUserId(param);
        break;
      default:
        console.log('Available commands:');
        console.log('  users - List all users');
        console.log('  user <email> - Find user by email');
        console.log('  contacts <userId> - Find emergency contacts for a user');
        console.log('  travel-requests <userId> - Find travel requests for a user');
        console.log('  pending-requests - Find all pending travel requests');
        console.log('  threats - Find all active threat locations');
        console.log('  notifications <userId> - Find notifications for a user');
        console.log('  unread-notifications <userId> - Find unread notifications for a user');
        result = { message: 'Please provide a valid command' };
    }
    
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await disconnect();
  }
}

// Run the script if executed directly
if (require.main === module) {
  main()
    .then(() => console.log('Script completed successfully!'))
    .catch(err => console.error('Script failed with error:', err))
    .finally(() => process.exit());
}

// Export functions for use in other scripts or the application
module.exports = {
  connect,
  disconnect,
  findAllUsers,
  findUserById,
  findUserByEmail,
  findEmergencyContactsByUserId,
  findAllTravelRequests,
  findPendingTravelRequests,
  findTravelRequestsByUserId,
  findMatchingTravelRequests,
  findAllThreatLocations,
  findActiveThreatLocations,
  findNearbyThreats,
  findNotificationsByUserId,
  findUnreadNotificationsByUserId
}; 