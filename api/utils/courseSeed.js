const CourseModel = require("../model/courseModel");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Sample course data with correct professor IDs
const courses = [
  {
    title: 'Advanced Algorithms',
    description: 'In-depth study of algorithm design and analysis.',
    courseDepartment: 'Computer Science',
    courseCode: 'CS-4102',
    instructor: '66f819a2d8d95823d1ef1179', // Professor Ayesha Khan's ID
    startdate: new Date('2024-09-28'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Software Engineering',
    description: 'Introduction to software development processes and life cycle.',
    courseDepartment: 'Computer Science',
    courseCode: 'CS-3101',
    instructor: '66f819a2d8d95823d1ef117a', // Professor Imran Siddiqui's ID
    startdate: new Date('2024-09-30'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Computer Networks',
    description: 'Basics of networking and communication protocols.',
    courseDepartment: 'IT',
    courseCode: 'IT-2203',
    instructor: '66f819a2d8d95823d1ef117b', // Professor Fatima Syed's ID
    startdate: new Date('2024-10-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Artificial Intelligence',
    description: 'Understanding AI concepts and neural networks.',
    courseDepartment: 'AI',
    courseCode: 'AI-3200',
    instructor: '66f819a2d8d95823d1ef117c', // Professor Ali Usman’s ID
    startdate: new Date('2024-09-22'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Cybersecurity',
    description: 'Fundamentals of network security and encryption.',
    courseDepartment: 'Computer Science',
    courseCode: 'CS-5100',
    instructor: '66f819a2d8d95823d1ef117d', // Professor Sana Iqbal’s ID
    startdate: new Date('2024-09-29'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Data Science',
    description: 'Introduction to data science tools and techniques.',
    courseDepartment: 'Data Science',
    courseCode: 'DS-4201',
    instructor: '66f819a2d8d95823d1ef1179', // Professor Ayesha Khan’s ID
    startdate: new Date('2024-10-05'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Machine Learning',
    description: 'Supervised and unsupervised learning algorithms.',
    courseDepartment: 'AI',
    courseCode: 'AI-3202',
    instructor: '66f819a2d8d95823d1ef117a', // Professor Imran Siddiqui’s ID
    startdate: new Date('2024-10-03'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Big Data Analytics',
    description: 'Methods and tools for analyzing big data.',
    courseDepartment: 'Data Science',
    courseCode: 'DS-5200',
    instructor: '66f819a2d8d95823d1ef117b', // Professor Fatima Syed’s ID
    startdate: new Date('2024-09-25'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Operating Systems',
    description: 'Concepts of modern operating systems and architecture.',
    courseDepartment: 'Computer Engineering',
    courseCode: 'CE-3102',
    instructor: '66f819a2d8d95823d1ef117c', // Professor Ali Usman’s ID
    startdate: new Date('2024-10-06'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Blockchain Technology',
    description: 'Introduction to blockchain and decentralized technologies.',
    courseDepartment: 'IT',
    courseCode: 'IT-5201',
    instructor: '66f819a2d8d95823d1ef117d', // Professor Sana Iqbal’s ID
    startdate: new Date('2024-09-26'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to seed course data
const seedCourses = async () => {
  try {
    // Clear existing course data
    await CourseModel.deleteMany({});
    console.log('Course collection cleared.');

    // Insert new course data
    const insertedCourses = await CourseModel.insertMany(courses);
    console.log('Courses seeded successfully:', insertedCourses);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding course data:', error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedCourses();
