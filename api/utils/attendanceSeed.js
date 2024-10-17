// attendanceSeed.js

// const AttendanceModel = require("../model/attendenceModel");

// _id
// 66f7f6fb0056af37a681f3d6
// date
// "08/28/2024"
// studentId
// 66f151c01840295ee2cee56b
// courseId
// 66f2cf058bbe7b5a34081280
// createdAt
// 2024-09-28T12:30:51.825+00:00
// updatedAt
// 2024-09-28T12:30:51.825+00:00
// __v
// 0

// make a seeder function for around 20 for first, 15 for second and 12 for third days of all three students with gaps in between for hildays
// students ids : 66f8187da403d9bda63cb7f3, 66f8187da403d9bda63cb7f4, 66f8187da403d9bda63cb7f5

// for the two courses with id : 66f81ca65ed533f856d80981, 66f81ca65ed533f856d80986

const AttendanceModel = require("../model/attendenceModel");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample attendance data for 3 students over 3 days with gaps (holidays)
const attendance = [
  // Day 1: First Day (20 attendances)
  ...Array(20).fill().map((_, index) => ({
    date: '08/28/2024',
    studentId: index % 3 === 0 ? '66f8187da403d9bda63cb7f3' : 
                index % 3 === 1 ? '66f8187da403d9bda63cb7f4' : 
                '66f8187da403d9bda63cb7f5',
    courseId: index < 10 ? '66f81ca65ed533f856d80981' : '66f81ca65ed533f856d80986',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  // Day 2: Second Day (15 attendances)
  ...Array(15).fill().map((_, index) => ({
    date: '08/30/2024',
    studentId: index % 3 === 0 ? '66f8187da403d9bda63cb7f3' : 
                index % 3 === 1 ? '66f8187da403d9bda63cb7f4' : 
                '66f8187da403d9bda63cb7f5',
    courseId: index < 8 ? '66f81ca65ed533f856d80981' : '66f81ca65ed533f856d80986',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),

  // Day 3: Third Day (12 attendances)
  ...Array(12).fill().map((_, index) => ({
    date: '09/02/2024',
    studentId: index % 3 === 0 ? '66f8187da403d9bda63cb7f3' : 
                index % 3 === 1 ? '66f8187da403d9bda63cb7f4' : 
                '66f8187da403d9bda63cb7f5',
    courseId: index < 6 ? '66f81ca65ed533f856d80981' : '66f81ca65ed533f856d80986',
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to seed attendance data
const seedAttendance = async () => {
  try {
    // Clear existing attendance data
    await AttendanceModel.deleteMany({});
    console.log('Attendance collection cleared.');

    // Insert new attendance data
    const insertedAttendance = await AttendanceModel.insertMany(attendance);
    console.log('Attendance seeded successfully:', insertedAttendance);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding attendance data:', error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedAttendance();
