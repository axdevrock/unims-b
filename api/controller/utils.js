
const CourseModel = require("../model/courseModel");
const TestModel = require("../model/testModel");













function checkMultipleScore(correctOptions, studentAnswer, correctAnswerss) {

    // console.log('--------------------------------------------------');
    
    // console.log('correctOptions', correctOptions); // Example: [ 'ssdfd', 'sfsdfzxc', 'sdf', 'sfdfsdffsdfdf' ]
    // console.log('studentAnswer', studentAnswer);  // Example: [ 'ssdfd', 'sfsdfzxc' ]
    // console.log('correctAnswerss', correctAnswerss); // Example: [ 0, 1, 3, 2 ] 
    if (studentAnswer?.length !== correctAnswerss?.length) {
        return false;
    }
 
    for (let i = 0; i < studentAnswer?.length; i++) {
        if (!correctOptions.includes(studentAnswer[i])) {
            return false;
        }
    }

    return true;  // Return true if all conditions are met
}


async function submitTestByStudent(req, res) {
    const { testId, studentId, response } = req.body;

    console.log(response);
    
   
  
    // if (!testId || !studentId || !response) {
    //   return res.status(400).send({
    //     success: false,
    //     message: 'Invalid request. Test ID, Student ID, and response are required.',
    //   });
    // }
  
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
          if (studentAnswer?.toLowerCase() === question?.correctAnswer?.toLowerCase()) {
            score += marksPerQuestion; 
          }  
        } else if (question.type === 'Single Choice') {
          // Comparing student's answer to the correct index option
          const correctOption = question.options[question.correctAnswer]; 
          if (studentAnswer === correctOption) {
            score += marksPerQuestion;
            console.log('Correct! Score added.');
          }  
        } else if (question.type === 'Multiple Choice') {

            let correctOptions = question?.options;
            let correctAnswerss = question?.correctAnswers;

            let isCorrectMXanswer =  checkMultipleScore(correctOptions,studentAnswer,correctAnswerss );

            console.log('value : ' , isCorrectMXanswer);
            
            if(isCorrectMXanswer){
                score += marksPerQuestion;
                console.log('Correct! Score added.');
            } 
        }
      });
   
      score = Math.round(score * 100) / 100;

      console.log('final', score);
      
   
  
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
  

  module.exports = { 
    submitTestByStudent, 
}