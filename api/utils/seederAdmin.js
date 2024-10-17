const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing
const dotenv = require('dotenv'); 
const adminModel = require('../model/adminModel');


// Load environment variables
dotenv.config();

// Sample admin data
const admins = [
  {
    name: 'System Admin 1',
    email: 'admin1@test.com',
    password: bcrypt.hashSync('password123', 10), // Hashing password
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'System Admin 2',
    email: 'admin2@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'System Admin 3',
    email: 'admin3@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'System Admin 4',
    email: 'admin4@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'System Admin 5',
    email: 'admin5@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to insert admin data
const seedAdmins = async () => {
  try {
    // Clear existing admin data
    await adminModel.deleteMany({});
    console.log('Admin collection cleared.');

    // Insert new admin data
    const insertedAdmins = await adminModel.insertMany(admins);
    console.log('Admin users seeded successfully:', insertedAdmins);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin data:', error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedAdmins();
