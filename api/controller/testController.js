// {
//     title: 'test1',
//     description: 'test for checking',
//     totalMarks: '100',
//     courseId: '66f152181840295ee2cee584',
//     quizQuestions: [
//       {
//         type: 'Single Choice',
//         question: 'a',
//         correctAnswer: 0,
//         options: [Array]
//       },
//       { type: 'Text', question: 'aaaaaaaaaaaaaa' },
//       { type: 'True/False', question: 't/f', correctAnswer: 'true' }
//     ]
//   }

const TestModel = require("../model/testModel");
const CourseModel = require("../model/courseModel");

// req.body.userId = decodedToken.id;
// req.body.role = decodedToken.role;


async function addQuiz(req,res) {
    const {title,description,courseId,totalMarks,quizQuestions} = req.body;
    try {
        
        let checkForCourse = await CourseModel.findById(courseId);

        if(!checkForCourse){
            return res.status(200).send({
                success: false,
                message: `course not found.`
            });
        }
        let checkForTest = await TestModel.findOne({title:title});

        if(checkForTest){
            return res.status(200).send({
                success: false,
                message: `Test with title already exist.`
            });
        }
        const newTest = new TestModel({
            title,
            description,
            courseId,
            totalMarks,
            quizQuestions:quizQuestions
        });
        
        await newTest.save();

        return res.status(201).send({
            success: true,
            message: `Test created succesfully.`
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error in add quiz ${error.message}`
        });
    }
} 
async function getAllQuiz(req,res) {
    
    const { courseId} = req.body; 
    try {
        
        let checkForCourse = await CourseModel.findById(courseId);

        if(!checkForCourse){
            return res.status(200).send({
                success: false,
                message: `course not found.`
            });
        }
        let AllTests = await TestModel.find({courseId:courseId}).populate('courseId')|| [];

         
  
        return res.status(201).send({
            success: true,
            data:AllTests,
            message: `All tests List fetched.`, 
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error in getting quiz ${error.message}`
        });
    }
}

async function getQuizDetails(req,res) {

    const {id} = req.params;
    console.log("id for test : ", id);
    
    try {
        
        let checkForTest = await TestModel.findById(id).populate({
            path: 'studentsAttended.studentId', 
            select: 'name email' 
          }).populate('courseId')

        if(!checkForTest){
            return res.status(200).send({
                success: false,
                message: `Test details not found.`
            });
        }
        // let Test = await TestModel.find({courseId:courseId}).populate('courseId')|| [];

         
  
        return res.status(201).send({
            success: true,
            data:checkForTest,
            message: `Test fetched.`, 
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: `Error in getting test ${error.message}`
        });
    }
}

async function submitTestByStudent(req, res) {
  const { testId, studentId, response } = req.body;
 

  if (!testId || !studentId || !response) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request. Test ID, Student ID, and response are required.',
    });
  }

  try {
    const checkForTest = await TestModel.findById(testId);

    if (!checkForTest) {
      return res.status(404).send({
        success: false,
        message: 'Test details not found.',
      });
    }
 

    const hasAttempted = checkForTest.studentsAttended.some(
      (entry) => entry.studentId.toString() === studentId
    );

    if (hasAttempted) {
      return res.status(409).send({
        success: false,
        message: 'Test has already been submitted by the student.',
      });
    }

    let score = 0;
    const { quizQuestions, totalMarks } = checkForTest;
    const marksPerQuestion = totalMarks / quizQuestions.length; 

    // Calculate the score based on the response
    quizQuestions.forEach((question, index) => {
      const studentAnswer = response[index]; 

      if (question.type === 'True/False') {
        if (studentAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          score += marksPerQuestion;
          console.log('Correct! Score added.');
        }  
      } else if (question.type === 'Single Choice') {
        // Comparing student's answer to the correct index option
        const correctOption = question.options[question.correctAnswer]; 
        if (studentAnswer === correctOption) {
          score += marksPerQuestion;
          console.log('Correct! Score added.');
        }  
      } else if (question.type === 'Multiple Choice') {
        const correctAnswers = new Set(question.correctAnswers.map(String)); // Convert correct answers to string
        const studentAnswers = new Set(Array.isArray(studentAnswer) ? studentAnswer.map(String) : [String(studentAnswer)]);
        
        if (
          correctAnswers.size === studentAnswers.size &&
          [...correctAnswers].every(answer => studentAnswers.has(answer))
        ) {
          score += marksPerQuestion;
          console.log('Correct! Score added.');
        } else {
          console.log('Incorrect.');
        }
      }
    });
 
    score = Math.round(score * 100) / 100;

    console.log('Final score:', score);

    const newData = {
      studentId,
      score,
      response,
    };
 
    checkForTest.studentsAttended.push(newData);
     
    await checkForTest.save();

    return res.status(201).send({
      success: true,
      message: 'Test submitted successfully.',
      data : score,
    });

  } catch (error) {
    console.error('Error submitting test:', error);

    return res.status(500).send({
      success: false,
      message: `Error submitting the test: ${error.message}`,
    });
  }
}


// async function submitTestByStudent(req, res) {
//     const { testId, studentId, response } = req.body;  
//     if (!testId || !studentId || !response) {
//       return res.status(400).send({
//         success: false,
//         message: 'Invalid request. Test ID, Student ID, and response are required.',
//       });
//     }
  
//     try { 
//       const checkForTest = await TestModel.findById(testId);
  
//       if (!checkForTest) {
//         return res.status(404).send({
//           success: false,
//           message: 'Test details not found.',
//         });
//       }
   
//       const hasAttempted = checkForTest.studentsAttended.some(
//         (entry) => entry.studentId.toString() === studentId
//       );
  
//       if (hasAttempted) {
//         return res.status(409).send({
//           success: false,
//           message: 'Test has already been submitted by the student.',
//         });
//       }

//       console.log(checkForTest);
      
//     const score = 0;
   
//       const newData = {
//         studentId,
//         score,
//         response,
//       };
   
//       checkForTest.studentsAttended.push(newData);

//       return null;
   
//       // await checkForTest.save();
  
//       // return res.status(201).send({
//       //   success: true,
//       //   message: 'Test submitted successfully.',
//       // });
//     } catch (error) {
//       // Log error details for debugging (if applicable)
//       console.error('Error submitting test:', error);
  
//       return res.status(500).send({
//         success: false,
//         message: `Error submitting the test: ${error.message}`,
//       });
//     }
//   }
 
// async function submitTestByStudent(req, res) {
//   const { testId, studentId, response } = req.body;

//   console.log('Received response:', response);
//   // Received response: {
//   //   '0': 'False',
//   //   '1': 'a',
//   //   '2': 'r',
//   //   '3': [ 'dfdfdfdfdfdf', 'fdfdfdghjl' ]
//   // }

//   if (!testId || !studentId || !response) {
//     return res.status(400).send({
//       success: false,
//       message: 'Invalid request. Test ID, Student ID, and response are required.',
//     });
//   }

//   try {
//     const checkForTest = await TestModel.findById(testId);

//     if (!checkForTest) {
//       return res.status(404).send({
//         success: false,
//         message: 'Test details not found.',
//       });
//     }

//     console.log(checkForTest);
//     // {
// //   _id: new ObjectId('6702c8082bdf2660691872a8'),
// //   title: 'This is test to check for score',
// //   description: 'This is test to check for score',
// //   courseId: new ObjectId('66f81ca65ed533f856d80981'),
// //   totalMarks: 40,
// //   quizQuestions: [
// //     {
// //       type: 'True/False',
// //       question: 'is this true ?',
// //       correctAnswer: 'true'
// //     },
// //     {
// //       type: 'Single Choice',
// //       question: 'This is a first single choice questoin with ans seconf option',
// //       correctAnswer: 1,
// //       options: [Array]
// //     },
// //     {
// //       type: 'Single Choice',
// //       question: 'This is a second sq with answer 1',
// //       correctAnswer: 0,
// //       options: [Array]
// //     },
// //     {
// //       type: 'Multiple Choice',
// //       question: 'This is a multiple with correct answer 2 and 4',    
// //       correctAnswers: [Array],
// //       options: [Array]
// //     }
// //   ],
// //   studentsAttended: [],
// //   createdAt: 2024-10-06T17:25:28.948Z,
// //   __v: 0
// // }


// console.log(checkForTest.quizQuestions)

// // [
// //   {
// //     type: 'True/False',
// //     question: 'is this true ?',
// //     correctAnswer: 'true'
// //   },
// //   {
// //     type: 'Single Choice',
// //     question: 'This is a first single choice questoin with ans seconf option',
// //     correctAnswer: 1,
// //     options: [ 'a', 's', 'd', 'f' ]
// //   },
// //   {
// //     type: 'Single Choice',
// //     question: 'This is a second sq with answer 1',
// //     correctAnswer: 0,
// //     options: [ 'q', 'w', 'e', 'r' ]
// //   },
// //   {
// //     type: 'Multiple Choice',
// //     question: 'This is a multiple with correct answer 2 and 4',      
// //     correctAnswers: [ 1, 3 ],
// //     options: [ 'dfdfdfdfdfdf', 'fdfdfdfabgn', 'fdfdfdghjl', 'fdfdfd' ]
// //   }
// // ]
    

//     const hasAttempted = checkForTest.studentsAttended.some(
//       (entry) => entry.studentId.toString() === studentId
//     );

//     if (hasAttempted) {
//       return res.status(409).send({
//         success: false,
//         message: 'Test has already been submitted by the student.',
//       });
//     }

//     let score = 0;
//     const { quizQuestions, totalMarks } = checkForTest;
//     const marksPerQuestion = totalMarks / quizQuestions.length;

//     console.log('Total marks:', totalMarks);
//     console.log('Number of questions:', quizQuestions.length);
//     console.log('Marks per question:', marksPerQuestion);

//     // Calculate the score based on the response
//     quizQuestions.forEach((question, index) => {
//       const studentAnswer = response[index];
//       console.log(`Question ${index + 1}:`);
//       console.log('Type:', question.type);
//       console.log('Student answer:', studentAnswer);
      
//       if (!question.correctAnswer && !question.correctAnswers) {
//         console.log('Correct answer is undefined.');
//         return; // Skip this question if correct answer is not defined
//       }

//       console.log('Correct answer:', question.correctAnswer || question.correctAnswers);

//       if (question.type === 'True/False') {
//         if (studentAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
//           score += marksPerQuestion;
//           console.log('Correct! Score added.');
//         } else {
//           console.log('Incorrect.');
//         }
//       } else if (question.type === 'Single Choice') {
//         // Ensure correctAnswer exists for single choice
//         if (typeof question.correctAnswer !== 'undefined' && String(studentAnswer) === String(question.options[question.correctAnswer])) {
//           score += marksPerQuestion;
//           console.log('Correct! Score added.');
//         } else {
//           console.log('Incorrect.');
//         }
//       } else if (question.type === 'Multiple Choice') {
//         // Ensure correctAnswers exists and compare arrays
//         if (question.correctAnswers && Array.isArray(question.correctAnswers)) {
//           const correctAnswers = new Set(question.correctAnswers.map(String));
//           const studentAnswers = new Set(Array.isArray(studentAnswer) ? studentAnswer.map(String) : [String(studentAnswer)]);

//           console.log('Correct answers:', [...correctAnswers]);
//           console.log('Student answers:', [...studentAnswers]);

//           if (
//             correctAnswers.size === studentAnswers.size &&
//             [...correctAnswers].every(answer => studentAnswers.has(answer))
//           ) {
//             score += marksPerQuestion;
//             console.log('Correct! Score added.');
//           } else {
//             console.log('Incorrect.');
//           }
//         } else {
//           console.log('Correct answers not properly defined for Multiple Choice.');
//         }
//       }
//     });

//     // Round the score to two decimal places
//     score = Math.round(score * 100) / 100;

//     console.log('Final score:', score);

//     const newData = {
//       studentId,
//       score,
//       response,
//     };

//     // Push the new data into studentsAttended
//     // checkForTest.studentsAttended.push(newData);
    
//     // Save the updated test with the student's submission
//     // await checkForTest.save();

//     // return res.status(201).send({
//     //   success: true,
//     //   message: 'Test submitted successfully.',
//     //   score,
//     // });

//   } catch (error) {
//     console.error('Error submitting test:', error);

//     return res.status(500).send({
//       success: false,
//       message: `Error submitting the test: ${error.message}`,
//     });
//   }
// }


  async function UpdateTest(req, res) {
    const { testId, studentId, score, response } = req.body; // Extract response from request body
      
  
    try {
      // Find the test by ID
      const checkForTest = await TestModel.findById(testId);
  
      if (!checkForTest) {
        return res.status(404).send({
          success: false,
          message: 'Test details not found.',
        });
      }
   
      const existingAttemptIndex = checkForTest.studentsAttended.findIndex(
        (entry) => entry.studentId.toString() === studentId
      );
  
      if (existingAttemptIndex !== -1) { 
        checkForTest.studentsAttended[existingAttemptIndex].score = score;
        checkForTest.studentsAttended[existingAttemptIndex].response = response;
  
        await checkForTest.save();
  
        return res.status(200).send({
          success: true,
          message: 'Test updated successfully.',
        });
      } else { 
        const newData = {
          studentId,
          score,
          response,
        };
  
        checkForTest.studentsAttended.push(newData);
  
        await checkForTest.save();
  
        return res.status(201).send({
          success: true,
          message: 'Test submitted successfully.',
        });
      }
    } catch (error) { 
      console.error('Error updating test:', error);
  
      return res.status(500).send({
        success: false,
        message: `Error submitting the test: ${error.message}`,
      });
    }
  }
  
  
  
module.exports = {
    addQuiz,
    getAllQuiz,
    getQuizDetails,
    submitTestByStudent,
    UpdateTest
}