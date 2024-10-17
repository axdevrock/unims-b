const { addAttendance,getStudentAttendanceForCourse,getStudentTodaysAttendance,getLeaderBoard, getLeaderBoardAssignment, getLeaderBoardTest} = require('../controller/attendanceController');
const { protectedRoute } = require('../middleware/authMiddleware');
const router = require('express').Router();


router.post('/add', addAttendance );
router.post('/get',getStudentAttendanceForCourse  ); 
router.post('/get-today',getStudentTodaysAttendance  ); 

// Leader Board

router.get('/lb/:id', getLeaderBoard );
router.get('/lbt/:id', getLeaderBoardTest );
router.get('/lba/:id', getLeaderBoardAssignment );

 
module.exports = router;
