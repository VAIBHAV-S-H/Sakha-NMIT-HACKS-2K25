const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

async function main() {
  console.log('Starting MongoDB Atlas connection test...');
  
  try {
    // MongoDB Atlas connection string
    const uri = "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    
    // Hide sensitive info in logs
    const uriSafe = uri.replace(/(mongodb\+srv:\/\/)([^@]+@)/, '$1****@');
    console.log(`Connecting to MongoDB Atlas: ${uriSafe}`);
    
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    
    // Verify connection with a ping
    await client.db("admin").command({ ping: 1 });
    console.log("Ping command successful. MongoDB Atlas is responsive.");
    
    // List databases
    const dbList = await client.db().admin().listDatabases();
    console.log('Available Databases:');
    dbList.databases.forEach(db => console.log(` - ${db.name}`));
    
    // Check if our application database exists
    const sakhaDb = dbList.databases.find(db => db.name === 'sakha');
    if (sakhaDb) {
      console.log('\nSakha database exists!');
      
      // List collections in the sakha database
      const db = client.db('sakha');
      const collections = await db.listCollections().toArray();
      
      if (collections.length > 0) {
        console.log('Collections in sakha database:');
        collections.forEach(collection => {
          console.log(` - ${collection.name}`);
        });
        
        // Get counts of documents in each collection
        console.log('\nDocument counts:');
        for (const collection of collections) {
          const count = await db.collection(collection.name).countDocuments();
          console.log(` - ${collection.name}: ${count} documents`);
        }
      } else {
        console.log('No collections found in the sakha database. Run the seed script to create collections.');
      }
    } else {
      console.log('\nSakha database does not exist yet. Run the seed script to create the database.');
    }
    
    await client.close();
    console.log('\nConnection closed');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

main()
  .then(() => console.log('Atlas test completed'))
  .catch(err => console.error('Atlas test failed:', err))
  .finally(() => process.exit()); 