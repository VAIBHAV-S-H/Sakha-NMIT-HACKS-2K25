import { MongoClient, ServerApiVersion } from 'mongodb';

// Connection URL
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If no cached connection exists, create a new one
  await client.connect();
  
  const db = client.db(databaseName);
  
  // Cache the connection
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  TRAVEL_REQUESTS: 'travel_requests',
  THREAT_LOCATIONS: 'threat_locations',
  NOTIFICATIONS: 'notifications'
}; 