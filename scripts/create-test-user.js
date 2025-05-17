const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Try to load environment variables from .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n').reduce((acc, line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        acc[match[1]] = match[2] || '';
      }
      return acc;
    }, {});
    
    // Set environment variables
    Object.keys(envVars).forEach(key => {
      process.env[key] = envVars[key];
    });
    
    console.log('Loaded environment variables from .env.local');
  }
} catch (error) {
  console.warn('Could not load .env.local file:', error.message);
}

// MongoDB Connection URL - use environment variable or fallback to localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sakha';
const MONGODB_DB = process.env.MONGODB_DB || 'sakha';

console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@')}`);

async function createTestUser() {
  // Create MongoDB client
  const client = new MongoClient(MONGODB_URI);
  
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');
    
    // Get the database
    const db = client.db(MONGODB_DB);
    
    // Get the users collection
    const usersCollection = db.collection('users');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create test user data
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+9188888888888',
      password: hashedPassword,
      rating: 4.5,
      reviewCount: 5,
      verified: true,
      location: 'Delhi, India',
      bio: 'This is a test user account for development purposes.',
      safetyScore: 85,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: testUser.email });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser._id.toString());
      console.log('Login credentials: email=test@example.com, password=password123');
      return;
    }
    
    // Insert the test user
    const result = await usersCollection.insertOne(testUser);
    console.log('Created test user with ID:', result.insertedId.toString());
    console.log('Login credentials: email=test@example.com, password=password123');
    
    // Create some threat location data
    const threatLocationsCollection = db.collection('threat_locations');
    
    // Create test threat locations
    const threatLocations = [
      {
        name: 'Unsafe Alley',
        description: 'Poorly lit alley with reported incidents',
        latitude: 28.6139,
        longitude: 77.2090,
        threatLevel: 'high',
        reportedBy: result.insertedId.toString(),
        reportedAt: new Date(),
        lastReportDate: new Date(),
        verified: true,
        verifiedBy: result.insertedId.toString(),
        verifiedAt: new Date(),
        votes: 5,
        reportCount: 3,
        category: 'poorLighting',
        timeOfDay: ['evening', 'night'],
        images: []
      },
      {
        name: 'Deserted Bus Stop',
        description: 'Isolated bus stop with few people around late at night',
        latitude: 28.6219,
        longitude: 77.2180,
        threatLevel: 'medium',
        reportedBy: result.insertedId.toString(),
        reportedAt: new Date(Date.now() - 3600000), // 1 hour ago
        lastReportDate: new Date(Date.now() - 3600000),
        verified: false,
        votes: 3,
        reportCount: 2,
        category: 'isolation',
        timeOfDay: ['night'],
        images: []
      },
      {
        name: 'Harassment Hotspot',
        description: 'Multiple reports of verbal harassment in this area',
        latitude: 28.6300,
        longitude: 77.2250,
        threatLevel: 'high',
        reportedBy: result.insertedId.toString(),
        reportedAt: new Date(Date.now() - 7200000), // 2 hours ago
        lastReportDate: new Date(Date.now() - 3600000),
        verified: true,
        verifiedBy: result.insertedId.toString(),
        verifiedAt: new Date(),
        votes: 12,
        reportCount: 6,
        category: 'harassment',
        timeOfDay: ['morning', 'afternoon', 'evening'],
        images: []
      }
    ];
    
    // Insert threat locations
    const locationResult = await threatLocationsCollection.insertMany(threatLocations);
    console.log(`Created ${locationResult.insertedCount} sample threat locations`);
    
    console.log('\nMongoDB integration is working properly!');
    console.log('You can now start your Next.js application with:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createTestUser().catch(console.error); 