const CourseModel = require("../model/courseModel");
const AttendenceModel = require("../model/attendenceModel"); 
const TestModel = require("../model/testModel");  
const AssignmentModel = require("../model/assignmentModel");  
const ExcelJS = require('exceljs/dist/es5');

async function getFStudents(req, res) {
    const {id} = req.params;
    try {
        let checkForCourse = await CourseModel
            .findById(id)
            .populate('students', 'name email');

        if (!checkForCourse) {
            return res
                .status(404)
                .send({success: false, message: `Course with ID ${id} not found.`});
        }

        let listOfStudents = checkForCourse
            ?.students;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${checkForCourse
            ?.title} student list`, {
            properties: {
                tabColor: {
                    argb: 'FFC0000'
                }
            }
        });

        worksheet.columns = [
            {
                header: 'S.no',
                key: 's_no',
                width: 10
            }, {
                header: 'S.id',
                key: '_id',
                width: 20
            }, {
                header: 'Name',
                key: 'name',
                width: 22
            }, {
                header: 'Email',
                key: 'email',
                width: 32, 
            }
        ];

        let count = 1;
        listOfStudents.forEach((user) => {
            worksheet.addRow({
                s_no: count,
                _id: user
                    ._id
                    .toString(),
                name: user.name,
                email: user.email
            });
            count += 1;
        });

        worksheet
            .getRow(1)
            .eachCell((cell) => {
                cell.font = {
                    bold: true
                };
            });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${checkForCourse
            ?.title}-student-list.xlsx`);

        await workbook
            .xlsx
            .write(res);
        res.end();

    } catch (error) {
        res
            .status(500)
            .send({success: false, message: `Error in generating student list: ${error.message}`});
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function getFAttendance(req, res) {
    const {id} = req.params;

    try {
        // Check if the course exists
        let checkForCourse = await CourseModel.findById(id);
        if (!checkForCourse) {
            return res
                .status(404)
                .send({success: false, message: `Course with ID ${id} not found.`});
        }

        // Fetch attendance records and populate student details
        let allAttendances = await AttendenceModel
            .find({courseId: id})
            .populate('studentId', 'name email')
            .sort({date: 1}); // Sort by date in ascending order

        if (!allAttendances.length) {
            return res
                .status(404)
                .send({success: false, message: `No attendance records found for course ID ${id}.`});
        }

        // Group attendance records by date
        let attendanceByDate = {};
        allAttendances.forEach(attendance => {
            const attendanceDate = attendance.date;
            if (!attendanceByDate[attendanceDate]) {
                attendanceByDate[attendanceDate] = [];
            }
            attendanceByDate[attendanceDate].push([attendance.studentId._id, attendance.studentId.name, attendance.studentId.email]);
        });

        // Create a new workbook and worksheet for Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Attendance Report - ${checkForCourse.title}`);

        // Define the columns for the Excel sheet
        worksheet.columns = [
            {
                header: 'Date',
                key: 'date',
                width: 20
            }, {
                header: 'Students Present',
                key: 'students_present',
                width: 50
            }
        ];

        // Add rows to the Excel file
        Object
            .keys(attendanceByDate)
            .forEach(date => {
                const students = attendanceByDate[date];
                worksheet.addRow({
                    date: date,
                    students_present: JSON.stringify(students) // Convert array to string for better readability
                });
            });

        // Format the header row to be bold
        worksheet
            .getRow(1)
            .eachCell((cell) => {
                cell.font = {
                    bold: true
                };
            });

        // Write the workbook to a buffer and send it as a response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="attendance_report.xlsx"`);

        await workbook
            .xlsx
            .write(res);
        res.end();

    } catch (error) {
        return res
            .status(500)
            .send({success: false, message: `Error in getting attendance report: ${error.message}`});
    }
}
 
async function getFTestScore(req, res) {
    const { id } = req.params;
    try {
      let checkForCourse = await CourseModel.findById(id).populate('students', 'name email');
      if (!checkForCourse) {
        return res.status(404).send({ success: false, message: `Course with ID ${id} not found.` });
      }
  
      let listOfStudents = checkForCourse.students;
      const courseName = checkForCourse.title;
  
      let testsForCourse = await TestModel.find({ courseId: id });
      if (!testsForCourse.length) {
        return res.status(404).send({ success: false, message: `No tests found for the course with ID ${id}.` });
      }
  
      let excelData = [];
  
      testsForCourse.forEach(test => {
        listOfStudents.forEach(student => {
          let submission = test.studentsAttended.find(att => att.studentId.toString() === student._id.toString());
          let studentScore = submission ? submission.score : 0;
          let totalMarks = test.totalMarks;
          let percentage = (studentScore / totalMarks) * 100;
  
          excelData.push({
            Course_Name: courseName,
            Test_Title: test.title,
            Student_ID: student._id,
            Student_Name: student.name,
            Student_Email: student.email,
            Student_Score: studentScore,
            Total_Marks: totalMarks,
            Percentage: percentage.toFixed(2)
          });
        });
      });
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Test Scores');
  
      worksheet.columns = [
        { header: 'Course Name', key: 'Course_Name' ,width: 22, },
        { header: 'Test Title', key: 'Test_Title' ,width: 22, },
        { header: 'Student ID', key: 'Student_ID' ,width: 22, },
        { header: 'Student Name', key: 'Student_Name' ,width: 22, },
        { header: 'Student Email', key: 'Student_Email' ,width: 22, },
        { header: 'Student Score', key: 'Student_Score'  ,width: 10,},
        { header: 'Total Marks', key: 'Total_Marks' ,width: 10, },
        { header: 'Percentage', key: 'Percentage' ,width: 10, }
      ];
  
      excelData.forEach(data => worksheet.addRow(data));

      worksheet
            .getRow(1)
            .eachCell((cell) => {
                cell.font = {
                    bold: true
                };
            });
  
      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', 'attachment; filename="test_scores.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
  
    } catch (error) {
      res.status(500).send({ success: false, message: `Error in generating student scores: ${error.message}` });
    }
  } 

  async function getFAssignmentScore(req, res) {
    const { id } = req.params;
    try {
      let checkForCourse = await CourseModel.findById(id).populate('students', 'name email');
      if (!checkForCourse) {
        return res.status(404).send({ success: false, message: `Course with ID ${id} not found.` });
      }
  
      let listOfStudents = checkForCourse.students;
      const courseName = checkForCourse.title;
  
      let assignmentsForCourse = await AssignmentModel.find({ course: id });
      if (!assignmentsForCourse.length) {
        return res.status(404).send({ success: false, message: `No assignments found for the course with ID ${id}.` });
      }
  
      let excelData = [];
  
      assignmentsForCourse.forEach(assignment => {
        listOfStudents.forEach(student => {
          let submission = assignment?.SubmittedBy.find(sub => sub.user.toString() === student._id.toString());
          let studentScore = submission ? submission.marks : 0;
  
          excelData.push({
            Course_Name: courseName,
            Test_Title: assignment.title,
            Student_ID: student._id,
            Student_Name: student.name,
            Student_Email: student.email,
            Student_Score: studentScore
          });
        });
      });
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Assignment Scores');
  
      worksheet.columns = [
        { header: 'Course Name', key: 'Course_Name', width: 22 },
        { header: 'Test Title', key: 'Test_Title', width: 22 },
        { header: 'Student ID', key: 'Student_ID', width: 22 },
        { header: 'Student Name', key: 'Student_Name', width: 22 },
        { header: 'Student Email', key: 'Student_Email', width: 22 },
        { header: 'Student Score', key: 'Student_Score', width: 10 }
      ];
  
      excelData.forEach(data => worksheet.addRow(data));
  
      worksheet
        .getRow(1)
        .eachCell((cell) => {
          cell.font = { bold: true };
        });
  
      const buffer = await workbook.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', 'attachment; filename="assignment_scores.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
  
    } catch (error) {
      res.status(500).send({ success: false, message: `Error in generating student scores: ${error.message}` });
    }
  }
  

//   Srtudents


async function getSStudentReport(req, res) {
    const {courseId, studentId} = req.body;
    try {
        let checkForCourse = await CourseModel
            .findById(id)
            .populate('students', 'name email');

        if (!checkForCourse) {
            return res
                .status(404)
                .send({success: false, message: `Course with ID ${id} not found.`});
        }

        let listOfStudents = checkForCourse
            ?.students;

       

    } catch (error) {
        res
            .status(500)
            .send({success: false, message: `Error in generating student list: ${error.message}`});
    }
}

async function getSTestReport(req, res) {
    const { courseId, studentId } = req.body;
    try { 
        let checkForCourse = await CourseModel
            .findById(courseId)
            .populate('students', 'name email');
 
        if (!checkForCourse) {
            return res
                .status(404)
                .send({ success: false, message: `Course with ID ${courseId} not found.` });
        }
 
        let listOfStudents = checkForCourse?.students;

        // Check whether the student is enrolled in the course
        let isStudentEnrolled = listOfStudents.some(student => student._id.toString() === studentId);
        
        if (!isStudentEnrolled) {
            return res
                .status(404)
                .send({ success: false, message: `Student with ID ${studentId} is not enrolled in this course.` });
        }
 
        let tests = await TestModel.find({ courseId, "studentsAttended.studentId": studentId });
 
        let studentTestReport = tests.map(test => {
            // Find the student's record in the 'studentsAttended' array
            let studentData = test.studentsAttended.find(stu => stu.studentId.toString() === studentId);
            return {
                title: test.title,
                score: studentData?.score || 0, // Default to 0 if no score
                totalMarks: test.totalMarks
            };
        });

        // Send the response with the student's test report
        return res.status(200).send({ success: true, data: studentTestReport });

    } catch (error) {
        // Handle any errors and send a 500 response
        return res
            .status(500)
            .send({ success: false, message: `Error in generating student report: ${error.message}` });
    }
}
async function getSAssignmentReport(req, res) {
    const { courseId, studentId } = req.body; // Expecting courseId and studentId from request body

    try {
        // Check if the course exists and populate the student data
        let course = await CourseModel.findById(courseId).populate('students', 'name email');

        if (!course) {
            return res.status(404).send({ success: false, message: `Course with ID ${courseId} not found.` });
        }

        // Get the list of students enrolled in the course
        let enrolledStudents = course.students;

        // Check whether the student is enrolled in the course
        let isStudentEnrolled = enrolledStudents.some(student => student._id.toString() === studentId);

        if (!isStudentEnrolled) {
            return res.status(404).send({ success: false, message: `Student with ID ${studentId} is not enrolled in this course.` });
        }

        // Fetch the assignments for the course
        let assignments = await AssignmentModel.find({ course: courseId });

        // Filter the assignments to find the submissions made by the student
        let studentAssignments = assignments.map(assignment => {
            // Find the submission for this student in the assignment's 'SubmittedBy' array
            let studentSubmission = assignment.SubmittedBy.find(sub => sub.user.toString() === studentId);

            // If the student has submitted this assignment, include the details in the response
            return {
                title: assignment.title,
                description: assignment.description,
                fileUrl: assignment.fileUrl,
                studentSubmission: studentSubmission
                    ? {
                        fileUrl: studentSubmission.fileUrl,
                        marks: studentSubmission.marks,
                        submittedAt: studentSubmission.submittedAt
                    }
                    : null // If the student hasn't submitted this assignment, return null
            };
        });

        // Send the response with the student's assignment report
        return res.status(200).send({ success: true, data: studentAssignments });

    } catch (error) {
        // Handle any errors and send a 500 response
        return res.status(500).send({ success: false, message: `Error in generating student assignment report: ${error.message}` });
    }
}

const getStudentAttendance = async (req, res) => {
    const { studentId, courseId } = req.body;
  
    try { 
      const attendanceRecords = await AttendenceModel.find({
        studentId,
        courseId,
      });
   
      const course = await CourseModel.findById(courseId);
  
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
   
      const totalDays = getDaysBetween(course.startdate, new Date()); 
  
      // Calculate attendance and absence
      const totalAttendance = attendanceRecords.length;
      const absences = totalDays - totalAttendance;
  
      return res.status(200).json({
        success: true,
        data: {
          totalAttendance,
          absences,
          totalDays, 
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error fetching attendance: ${error.message}`,
      });
    }
  };
  
  // Helper function to calculate the number of days between two dates
  function getDaysBetween(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    return Math.round(Math.abs((new Date(startDate) - new Date(endDate)) / oneDay));
  }
  

module.exports = {
    getFTestScore,
    getFAttendance,
    getFStudents,
    getFAssignmentScore,
    getSStudentReport,
    getSTestReport,
    getSAssignmentReport,
    getStudentAttendance,

}