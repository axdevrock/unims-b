const professorModel = require("../model/professorModel");

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv'); 

// Load environment variables
dotenv.config();

// Sample professor data (password is the same as their email)
const professors = [
  {
    name: 'Ayesha Khan',
    email: 'ayesha.khan@p.com',
    password: bcrypt.hashSync('ayesha.khan@p.com', 10), // Hashed password (same as email)
    role: 'faculty',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Imran Siddiqui',
    email: 'imran.siddiqui@p.com',
    password: bcrypt.hashSync('imran.siddiqui@p.com', 10), 
    role: 'faculty',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Fatima Syed',
    email: 'fatima.syed@p.com',
    password: bcrypt.hashSync('fatima.syed@p.com', 10), 
    role: 'faculty',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Ali Usman',
    email: 'ali.usman@p.com',
    password: bcrypt.hashSync('ali.usman@p.com', 10), 
    role: 'faculty',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sana Iqbal',
    email: 'sana.iqbal@p.com',
    password: bcrypt.hashSync('sana.iqbal@p.com', 10), 
    role: 'faculty',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to insert professor data
const seedProfessors = async () => {
  try {
    // Clear existing professor data
    await professorModel.deleteMany({});
    console.log('Professor collection cleared.');

    // Insert new professor data
    const insertedProfessors = await professorModel.insertMany(professors);
    console.log('Professors seeded successfully:', insertedProfessors);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding professor data:', error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedProfessors();
