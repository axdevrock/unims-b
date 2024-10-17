const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv'); 
const studentModel = require('../model/studentModel');

dotenv.config();

// Sample student data (password is the same as their email)
const students = [
  {
    name: 'Aarav Singh',
    email: 'aarav@s.com',
    password: bcrypt.hashSync('aarav@s.com', 10), // Hashed password (same as email)
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Priya Sharma',
    email: 'priya@s.com',
    password: bcrypt.hashSync('priya@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Vikas Gupta',
    email: 'vikas@s.com',
    password: bcrypt.hashSync('vikas@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya@s.com',
    password: bcrypt.hashSync('ananya@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Rohit Rao',
    email: 'rohit@s.com',
    password: bcrypt.hashSync('rohit@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@s.com',
    password: bcrypt.hashSync('sneha@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun@s.com',
    password: bcrypt.hashSync('arjun@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Meera Nair',
    email: 'meera@s.com',
    password: bcrypt.hashSync('meera@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Raj Kumar',
    email: 'raj@s.com',
    password: bcrypt.hashSync('raj@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Divya Desai',
    email: 'divya@s.com',
    password: bcrypt.hashSync('divya@s.com', 10), 
    role: 'student', 
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to insert student data
const seedStudents = async () => {
  try {
    // Clear existing student data
    await studentModel.deleteMany({});
    console.log('Student collection cleared.');

    // Insert new student data
    const insertedStudents = await studentModel.insertMany(students);
    console.log('Students seeded successfully:', insertedStudents);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding student data:', error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedStudents();
