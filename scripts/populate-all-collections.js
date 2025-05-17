const { exec } = require('child_process');
const path = require('path');

// Helper function to run a script and wait for it to complete
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Running ${path.basename(scriptPath)} ===`);
    
    const childProcess = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptPath}: ${error}`);
        return reject(error);
      }
      
      if (stderr) {
        console.error(`Script ${scriptPath} stderr: ${stderr}`);
      }
      
      console.log(stdout);
      resolve();
    });
    
    // Forward stdout and stderr to console in real-time
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  });
}

// Main function to run all scripts in sequence
async function populateAllCollections() {
  try {
    console.log("Starting to populate all collections with sample data...");
    
    // First clean existing data
    console.log("\n=== Cleaning existing data ===");
    await runScript(path.join(__dirname, 'clean-collections.js'));
    
    // Then add data in correct sequence
    
    // 1. Users first (other entities depend on users)
    await runScript(path.join(__dirname, 'add-sample-users.js'));
    
    // 2. Threat locations (independent of other entities)
    await runScript(path.join(__dirname, 'add-more-threat-locations.js'));
    
    // 3. Emergency contacts (depends on users)
    await runScript(path.join(__dirname, 'add-sample-emergency-contacts.js'));
    
    // 4. Travel requests (depends on users)
    await runScript(path.join(__dirname, 'add-sample-travel-requests.js'));
    
    // 5. Geofences (depends on users)
    await runScript(path.join(__dirname, 'add-sample-geofences.js'));
    
    // 6. Notifications (depends on users, threats, and geofences)
    await runScript(path.join(__dirname, 'add-sample-notifications.js'));
    
    console.log("\n=== All collections populated successfully! ===");
  } catch (error) {
    console.error("Error populating collections:", error);
    process.exit(1);
  }
}

// Create clean-collections.js if it doesn't exist (delete all existing records)
const fs = require('fs');
const cleanScriptPath = path.join(__dirname, 'clean-collections.js');

if (!fs.existsSync(cleanScriptPath)) {
  console.log("Creating clean-collections.js script...");
  
  const cleanScript = `const { MongoClient, ServerApiVersion } = require('mongodb');
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
      console.log(\`Cleaned \${result.deletedCount} documents from \${collectionName}\`);
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
  .finally(() => process.exit());`;
  
  fs.writeFileSync(cleanScriptPath, cleanScript);
  console.log("Created clean-collections.js script");
}

// Run the population script
populateAllCollections(); 