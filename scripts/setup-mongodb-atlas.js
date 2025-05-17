/**
 * MongoDB Atlas Setup Instructions
 * 
 * This script provides guidance on how to set up MongoDB Atlas for the Sakha application.
 * Follow these steps to create and configure your MongoDB Atlas database.
 */

console.log(`
=== MongoDB Atlas Setup Guide ===

1. Go to https://www.mongodb.com/cloud/atlas/register and create an account if you don't have one.

2. Create a new project named "Sakha" (or any name of your choice).

3. Create a new cluster:
   - Select the "FREE" tier (Shared Cluster)
   - Choose a cloud provider and region closest to you
   - Click "Create Cluster"

4. While the cluster is being created, set up database access:
   - In the left sidebar, click "Database Access"
   - Add a new database user with username/password authentication
   - Use a strong password and save it securely
   - Set user privileges to "Read and write to any database"

5. Set up network access:
   - In the left sidebar, click "Network Access"
   - Click "Add IP Address"
   - For development, you can add "0.0.0.0/0" to allow access from anywhere
   - For production, specify the IP address of your hosting environment

6. Once your cluster is created, click "Connect"
   - Select "Connect your application"
   - Choose "Node.js" as the driver and the latest version
   - Copy the connection string

7. Create an .env.local file in your project root with the following content:
   
   MONGODB_URI=<your_mongodb_connection_string>
   MONGODB_DB=sakha
   
   Replace <your_mongodb_connection_string> with the connection string you copied,
   and replace <password> in that string with your database user's password.

8. Run the test user creation script:
   
   node scripts/create-test-user.js

Now your MongoDB Atlas database should be set up and ready to use with the Sakha application.
`);

console.log(`
=== Atlas Search Setup (Optional) ===

If you want to enable search functionality for threat locations:

1. Navigate to your cluster's dashboard in MongoDB Atlas
2. Click "Search" in the left sidebar
3. Click "Create Search Index"
4. Select "Visual Editor" and the database "sakha"
5. Choose the collection "threat_locations" and name your index "threat_search"
6. Keep the default settings and click "Create Index"

This will enable full-text search capabilities for your application.
`); 