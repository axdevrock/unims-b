const mongoose = require('mongoose');

// Define the schema for the Test model
const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  totalMarks: {
      type: Number,
      required: true
    },
  quizQuestions: [],
  studentsAttended: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'student',
      required: true
    },
    response:{
        
    },
    score: {
      type: Number,
      required: true, 
    }, 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TestModel = mongoose.model('Test', testSchema);

module.exports = TestModel;
