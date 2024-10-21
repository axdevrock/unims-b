const { addQuiz,getAllQuiz,getQuizDetails, UpdateTest} = require('../controller/testController');
const { submitTestByStudent } = require('../controller/utils');
const { protectedRoute } = require('../middleware/authMiddleware');
const router = require('express').Router();


router.post('/add',  addQuiz);
router.post('/get-all-quiz',  getAllQuiz);
router.get('/single-quiz/:id',  getQuizDetails);

router.post('/submit-test',submitTestByStudent)
router.put('/update-test/:id',UpdateTest)
 
module.exports = router;
