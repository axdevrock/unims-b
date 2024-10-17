const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    date: {
  type: String,
  required: true,
  default: () => {
    return new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }
},

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student', 
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', 
        required: true
    },
   
}, { timestamps: true }); 

const AttendanceModel = mongoose.model('Attendance', attendanceSchema);

module.exports = AttendanceModel;
