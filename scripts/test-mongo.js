const { MongoClient } = require('mongodb');

async function main() {
  console.log('Starting MongoDB connection test...');
  
  try {
    const uri = 'mongodb://localhost:27017/sakha';
    console.log(`Connecting to MongoDB: ${uri}`);
    
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB!');
    
    const dbList = await client.db().admin().listDatabases();
    console.log('Databases:');
    dbList.databases.forEach(db => console.log(` - ${db.name}`));
    
    await client.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

main()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err))
  .finally(() => process.exit()); 