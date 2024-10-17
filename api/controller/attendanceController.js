const TestModel = require("../model/testModel");
const CourseModel = require("../model/courseModel");
const AttendanceModel = require("../model/attendenceModel");
const AssignmentModel = require("../model/assignmentModel");
 

// req.body.userId = decodedToken.id;
// req.body.role = decodedToken.role; 

async function addAttendance(req, res) {
    const { courseId, studentId } = req.body;
   
    let todaysdate = new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
 
    
  
    try { 
      let checkForCourse = await CourseModel.findById(courseId);
   
      if (!checkForCourse) {
        return res.status(404).send({
          success: false,
          message: `Course with ID ${courseId} not found.`
        });
      }
   
      let checkForStudent = checkForCourse.students.find(
        (student) => student.toString() === studentId
      );
   
      if (!checkForStudent) {
        return res.status(404).send({
          success: false,
          message: `Student with ID ${studentId} not found in the course.`
        });
      }
   
      let attendanceCheck = await AttendanceModel.findOne({
        date: todaysdate,
        courseId: courseId,
        studentId: studentId
      });
   
      if (attendanceCheck) {
        return res.status(409).send({
          success: false,
          message: `Attendance for the student on ${todaysdate} has already been submitted.`
        });
      }
      
      const addAttendanceForToday = new AttendanceModel({
        date: todaysdate,
        courseId: courseId,
        studentId: studentId
      });
  
      await addAttendanceForToday.save();
   
      return res.status(201).send({
        success: true,
        message: `Attendance recorded successfully for ${todaysdate}.`
      });
  
    } catch (error) { 
      res.status(500).send({
        success: false,
        message: `Error in adding attendance: ${error.message}`
      });
    }
  } 
async function getStudentAttendanceForCourse(req, res) {
    const { courseId, studentId } = req.body;  
    try { 
      let checkForCourse = await CourseModel.findById(courseId);
   
      if (!checkForCourse) {
        return res.status(404).send({
          success: false,
          message: `Course with ID ${courseId} not found.`
        });
      }

      let startDate = checkForCourse?.startdate ;
   
      let checkForStudent = checkForCourse.students.find(
        (student) => student.toString() === studentId
      );
   
      if (!checkForStudent) {
        return res.status(404).send({
          success: false,
          message: `Student with ID ${studentId} not found in the course.`
        });
      }
   
      let attendanceDetails = await AttendanceModel.find({ 
        courseId: courseId,
        studentId: studentId
      });
    
      return res.status(201).send({
        success: true,
        data:{
          startDate,
          attendanceDetails
        },
        message: `Attendance recorded fetched succesfully..`
      });
  
    } catch (error) { 
      res.status(500).send({
        success: false,
       
        message: `Error in adding attendance: ${error.message}`
      });
    }
  }
  
  async function getStudentTodaysAttendance(req, res) {
    const { courseId, studentId } = req.body;
   
    let todaysdate = new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
 
    
  
    try { 
      let checkForCourse = await CourseModel.findById(courseId);
   
      if (!checkForCourse) {
        return res.status(404).send({
          success: false,
          message: `Course with ID ${courseId} not found.`
        });
      }
   
      let checkForStudent = checkForCourse.students.find(
        (student) => student.toString() === studentId
      );
   
      if (!checkForStudent) {
        return res.status(404).send({
          success: false,
          message: `Student with ID ${studentId} not found in the course.`
        });
      }
   
      let attendanceCheck = await AttendanceModel.findOne({
        date: todaysdate,
        courseId: courseId,
        studentId: studentId
      });
   
      if (attendanceCheck) {
        return res.status(201).send({
          success: true,
          data:true,
          message: `Attendance for the student on ${todaysdate}`
        });
      } 
      return res.status(201).send({
        success: true,
        data:false,
        message: `Attendance recorded successfully for ${todaysdate}.`
      });
  
    } catch (error) { 
      res.status(500).send({
        success: false,
        message: `Error in adding attendance: ${error.message}`
      });
    }
  } 

 
  async function getLeaderBoard(req, res) {
    const { id } = req.params;
  
    try {
      const AllAttendances = await AttendanceModel.find({ courseId: id })
        .populate('studentId', 'name email');
  
      let attendanceCount = {};
  
      AllAttendances.forEach(attendance => {
        const studentId = attendance.studentId._id.toString();
  
        if (attendanceCount[studentId]) {
          attendanceCount[studentId].count++;
        } else {
          attendanceCount[studentId] = {
            count: 1,
            name: attendance.studentId.name,
            email: attendance.studentId.email,
          };
        }
      });
  
      const leaderboard = Object.keys(attendanceCount).map(studentId => ({
        studentId,
        name: attendanceCount[studentId].name,
        email: attendanceCount[studentId].email,
        attendanceCount: attendanceCount[studentId].count,
      }));
  
      leaderboard.sort((a, b) => b.attendanceCount - a.attendanceCount);
  
      return res.status(200).send({
        success: true,
        data: leaderboard.slice(0,3),
        message: `Leaderboard generated successfully.`,
      });
  
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `Error in generating leaderboard: ${error.message}`,
      });
    }
  }
  
  
  async function getLeaderBoardTest(req, res) {
    const { id } = req.params;
  
    try { 
      const AllQuizzes = await TestModel.find({ courseId: id })
        .populate('studentsAttended.studentId', 'name email');
  
      let scoreCount = {};
   
      AllQuizzes.forEach(quiz => {
        quiz.studentsAttended.forEach(student => {
          const studentId = student.studentId._id.toString(); 
          if (scoreCount[studentId]) {
            scoreCount[studentId].totalScore += student.score;
          } else {
            scoreCount[studentId] = {
              totalScore: student.score,
              name: student.studentId.name,
              email: student.studentId.email,
            };
          }
        });
      });
   
      const leaderboard = Object.keys(scoreCount).map(studentId => ({
        studentId,
        name: scoreCount[studentId].name,
        email: scoreCount[studentId].email,
        totalScore: scoreCount[studentId].totalScore,
      }));
   
      leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  
      // Return the top 3 students
      return res.status(200).send({
        success: true,
        data: leaderboard.slice(0, 3),
        message: `Leaderboard generated successfully.`,
      });
  
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: `Error in generating leaderboard: ${error.message}`,
      });
    }
  }
  
  
async function getLeaderBoardAssignment(req, res) {
  const { id } = req.params;

  try {
    // Find all assignments for the given course
    const AllAssignments = await AssignmentModel.find({ course: id })
      .populate('SubmittedBy.user', 'name email');

    let scoreCount = {}; 
    AllAssignments.forEach(assignment => {
      assignment.SubmittedBy.forEach(submission => {
        const studentId = submission.user._id.toString();
 
        if (scoreCount[studentId]) {
          scoreCount[studentId].totalMarks += parseInt(submission.marks);
        } else {
          scoreCount[studentId] = {
            totalMarks: parseInt(submission.marks),
            name: submission.user.name,
            email: submission.user.email,
          };
        }
      });
    });
 
    const leaderboard = Object.keys(scoreCount).map(studentId => ({
      studentId,
      name: scoreCount[studentId].name,
      email: scoreCount[studentId].email,
      totalMarks: scoreCount[studentId].totalMarks,
    }));
 
    leaderboard.sort((a, b) => b.totalMarks - a.totalMarks);
 
    return res.status(200).send({
      success: true,
      data: leaderboard.slice(0, 3),
      message: `Leaderboard generated successfully.`,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Error in generating leaderboard: ${error.message}`,
    });
  }
}
module.exports = {
    addAttendance,
    getStudentAttendanceForCourse,
    getStudentTodaysAttendance,
    getLeaderBoard,
    getLeaderBoardTest,
    getLeaderBoardAssignment
}