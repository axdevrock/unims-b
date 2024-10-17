const { getFStudents, getFAttendance,getSAssignmentReport, getFTestScore, getFAssignmentScore, getSStudentReport, getSTestReport, getStudentAttendance } = require('../controller/reportController');
const { protectedRoute } = require('../middleware/authMiddleware');
const router = require('express').Router();


router.get('/f',(req,res)=>{
    return res.json({
        data:true
    })
}  );
router.get('/f/students/:id',getFStudents  );
router.get('/f/attendances/:id',getFAttendance  ); 
router.get('/f/testscore/:id',getFTestScore ); 
router.get('/f/assignment/:id',getFAssignmentScore ); 

// Student

router.post('/s/attendance',getStudentAttendance  );
router.post('/s/test',getSTestReport  );
router.post('/s/assignment',getSAssignmentReport  );

 
module.exports = router;
