const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI || "mongodb+srv://1nt22cs211vaibhav:cuF0d97VrNwkpXQu@cluster0.bktaqdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'sakha_app';

async function addSampleUsers() {
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
    const collection = db.collection('users');
    
    // Sample users data
    const users = [
      {
        email: "priya.sharma@example.com",
        name: "Priya Sharma",
        phone: "+919876543210",
        profileImage: "/images/profiles/user1.jpg",
        rating: 4.8,
        reviewCount: 15,
        verified: true,
        createdAt: new Date("2023-04-15"),
        updatedAt: new Date("2023-04-15")
      },
      {
        email: "neha.patel@example.com",
        name: "Neha Patel",
        phone: "+919876543211",
        profileImage: "/images/profiles/user2.jpg",
        rating: 4.5,
        reviewCount: 8,
        verified: true,
        createdAt: new Date("2023-04-16"),
        updatedAt: new Date("2023-04-16")
      },
      {
        email: "vikram.singh@example.com",
        name: "Vikram Singh",
        phone: "+919876543212",
        profileImage: "/images/profiles/user3.jpg",
        rating: 4.7,
        reviewCount: 12,
        verified: true,
        createdAt: new Date("2023-04-17"),
        updatedAt: new Date("2023-04-17")
      },
      {
        email: "aisha.khan@example.com",
        name: "Aisha Khan",
        phone: "+919876543213",
        profileImage: "/images/profiles/user4.jpg",
        rating: 4.9,
        reviewCount: 20,
        verified: true,
        createdAt: new Date("2023-04-18"),
        updatedAt: new Date("2023-04-18")
      },
      {
        email: "rahul.verma@example.com",
        name: "Rahul Verma",
        phone: "+919876543214",
        profileImage: "/images/profiles/user5.jpg",
        rating: 4.3,
        reviewCount: 6,
        verified: true,
        createdAt: new Date("2023-04-19"),
        updatedAt: new Date("2023-04-19")
      },
      {
        email: "divya.gupta@example.com",
        name: "Divya Gupta",
        phone: "+919876543215",
        profileImage: "/images/profiles/user6.jpg",
        rating: 4.6,
        reviewCount: 10,
        verified: true,
        createdAt: new Date("2023-04-20"),
        updatedAt: new Date("2023-04-20")
      },
      {
        email: "amit.kumar@example.com",
        name: "Amit Kumar",
        phone: "+919876543216",
        profileImage: "/images/profiles/user7.jpg",
        rating: 4.4,
        reviewCount: 7,
        verified: true,
        createdAt: new Date("2023-04-21"),
        updatedAt: new Date("2023-04-21")
      },
      {
        email: "sneha.joshi@example.com",
        name: "Sneha Joshi",
        phone: "+919876543217",
        profileImage: "/images/profiles/user8.jpg",
        rating: 4.7,
        reviewCount: 13,
        verified: true,
        createdAt: new Date("2023-04-22"),
        updatedAt: new Date("2023-04-22")
      },
      {
        email: "rajat.tiwari@example.com",
        name: "Rajat Tiwari",
        phone: "+919876543218",
        profileImage: "/images/profiles/user9.jpg",
        rating: 4.2,
        reviewCount: 5,
        verified: true,
        createdAt: new Date("2023-04-23"),
        updatedAt: new Date("2023-04-23")
      },
      {
        email: "pooja.mehta@example.com",
        name: "Pooja Mehta",
        phone: "+919876543219",
        profileImage: "/images/profiles/user10.jpg",
        rating: 4.8,
        reviewCount: 16,
        verified: true,
        createdAt: new Date("2023-04-24"),
        updatedAt: new Date("2023-04-24")
      },
      {
        email: "kabir.singh@example.com",
        name: "Kabir Singh",
        phone: "+919876543220",
        profileImage: "/images/profiles/user11.jpg",
        rating: 4.1,
        reviewCount: 4,
        verified: true,
        createdAt: new Date("2023-04-25"),
        updatedAt: new Date("2023-04-25")
      },
      {
        email: "meera.rao@example.com",
        name: "Meera Rao",
        phone: "+919876543221",
        profileImage: "/images/profiles/user12.jpg",
        rating: 4.9,
        reviewCount: 22,
        verified: true,
        createdAt: new Date("2023-04-26"),
        updatedAt: new Date("2023-04-26")
      },
      {
        email: "arjun.kapoor@example.com",
        name: "Arjun Kapoor",
        phone: "+919876543222",
        profileImage: "/images/profiles/user13.jpg",
        rating: 4.5,
        reviewCount: 9,
        verified: true,
        createdAt: new Date("2023-04-27"),
        updatedAt: new Date("2023-04-27")
      },
      {
        email: "zoya.ahmed@example.com",
        name: "Zoya Ahmed",
        phone: "+919876543223",
        profileImage: "/images/profiles/user14.jpg",
        rating: 4.7,
        reviewCount: 14,
        verified: true,
        createdAt: new Date("2023-04-28"),
        updatedAt: new Date("2023-04-28")
      },
      {
        email: "vivek.malhotra@example.com",
        name: "Vivek Malhotra",
        phone: "+919876543224",
        profileImage: "/images/profiles/user15.jpg",
        rating: 4.3,
        reviewCount: 6,
        verified: true,
        createdAt: new Date("2023-04-29"),
        updatedAt: new Date("2023-04-29")
      },
      {
        email: "ritu.sharma@example.com",
        name: "Ritu Sharma",
        phone: "+919876543225",
        profileImage: "/images/profiles/user16.jpg",
        rating: 4.6,
        reviewCount: 11,
        verified: true,
        createdAt: new Date("2023-04-30"),
        updatedAt: new Date("2023-04-30")
      },
      {
        email: "sameer.desai@example.com",
        name: "Sameer Desai",
        phone: "+919876543226",
        profileImage: "/images/profiles/user17.jpg",
        rating: 4.4,
        reviewCount: 8,
        verified: true,
        createdAt: new Date("2023-05-01"),
        updatedAt: new Date("2023-05-01")
      },
      {
        email: "nisha.reddy@example.com",
        name: "Nisha Reddy",
        phone: "+919876543227",
        profileImage: "/images/profiles/user18.jpg",
        rating: 4.8,
        reviewCount: 17,
        verified: true,
        createdAt: new Date("2023-05-02"),
        updatedAt: new Date("2023-05-02")
      },
      {
        email: "rohan.jain@example.com",
        name: "Rohan Jain",
        phone: "+919876543228",
        profileImage: "/images/profiles/user19.jpg",
        rating: 4.2,
        reviewCount: 5,
        verified: true,
        createdAt: new Date("2023-05-03"),
        updatedAt: new Date("2023-05-03")
      },
      {
        email: "ananya.bose@example.com",
        name: "Ananya Bose",
        phone: "+919876543229",
        profileImage: "/images/profiles/user20.jpg",
        rating: 4.7,
        reviewCount: 15,
        verified: true,
        createdAt: new Date("2023-05-04"),
        updatedAt: new Date("2023-05-04")
      },
      {
        email: "deepak.choudhary@example.com",
        name: "Deepak Choudhary",
        phone: "+919876543230",
        profileImage: "/images/profiles/user21.jpg",
        rating: 4.5,
        reviewCount: 10,
        verified: true,
        createdAt: new Date("2023-05-05"),
        updatedAt: new Date("2023-05-05")
      },
      {
        email: "tanvi.singhania@example.com",
        name: "Tanvi Singhania",
        phone: "+919876543231",
        profileImage: "/images/profiles/user22.jpg",
        rating: 4.9,
        reviewCount: 21,
        verified: true,
        createdAt: new Date("2023-05-06"),
        updatedAt: new Date("2023-05-06")
      },
      {
        email: "kunal.mehra@example.com",
        name: "Kunal Mehra",
        phone: "+919876543232",
        profileImage: "/images/profiles/user23.jpg",
        rating: 4.3,
        reviewCount: 7,
        verified: true,
        createdAt: new Date("2023-05-07"),
        updatedAt: new Date("2023-05-07")
      },
      {
        email: "aditi.krishnan@example.com",
        name: "Aditi Krishnan",
        phone: "+919876543233",
        profileImage: "/images/profiles/user24.jpg",
        rating: 4.6,
        reviewCount: 12,
        verified: true,
        createdAt: new Date("2023-05-08"),
        updatedAt: new Date("2023-05-08")
      },
      {
        email: "prakash.gill@example.com",
        name: "Prakash Gill",
        phone: "+919876543234",
        profileImage: "/images/profiles/user25.jpg",
        rating: 4.4,
        reviewCount: 9,
        verified: true,
        createdAt: new Date("2023-05-09"),
        updatedAt: new Date("2023-05-09")
      },
      {
        email: "kavita.lamba@example.com",
        name: "Kavita Lamba",
        phone: "+919876543235",
        profileImage: "/images/profiles/user26.jpg",
        rating: 4.7,
        reviewCount: 16,
        verified: true,
        createdAt: new Date("2023-05-10"),
        updatedAt: new Date("2023-05-10")
      },
      {
        email: "mohit.saxena@example.com",
        name: "Mohit Saxena",
        phone: "+919876543236",
        profileImage: "/images/profiles/user27.jpg",
        rating: 4.2,
        reviewCount: 6,
        verified: true,
        createdAt: new Date("2023-05-11"),
        updatedAt: new Date("2023-05-11")
      },
      {
        email: "jyoti.khanna@example.com",
        name: "Jyoti Khanna",
        phone: "+919876543237",
        profileImage: "/images/profiles/user28.jpg",
        rating: 4.8,
        reviewCount: 18,
        verified: true,
        createdAt: new Date("2023-05-12"),
        updatedAt: new Date("2023-05-12")
      },
      {
        email: "nikhil.menon@example.com",
        name: "Nikhil Menon",
        phone: "+919876543238",
        profileImage: "/images/profiles/user29.jpg",
        rating: 4.5,
        reviewCount: 11,
        verified: true,
        createdAt: new Date("2023-05-13"),
        updatedAt: new Date("2023-05-13")
      },
      {
        email: "anjali.thakur@example.com",
        name: "Anjali Thakur",
        phone: "+919876543239",
        profileImage: "/images/profiles/user30.jpg",
        rating: 4.6,
        reviewCount: 13,
        verified: true,
        createdAt: new Date("2023-05-14"),
        updatedAt: new Date("2023-05-14")
      }
    ];
    
    // Insert the users
    const result = await collection.insertMany(users);
    
    console.log(`${result.insertedCount} users added`);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

// Run the script
addSampleUsers()
  .then(() => console.log("Sample users added successfully"))
  .catch(console.error)
  .finally(() => process.exit()); 