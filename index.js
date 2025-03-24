// The provided course information.
const CourseInfo = {
   id: 451,
   name: "Introduction to JavaScript"
};

 // The provided assignment group.
const AssignmentGroup = {
   id: 12345,
   name: "Fundamentals of JavaScript",
   course_id: 451,
   group_weight: 25,
   assignments: [
   {
       id: 1,
       name: "Declare a Variable",
       due_at: "2023-01-25",
       points_possible: 50
   },
   {
       id: 2,
       name: "Write a Function",
       due_at: "2023-02-27",
       points_possible: 150
   },
   {
       id: 3,
       name: "Code the World",
       due_at: "3156-11-15",
       points_possible: 500
   }
   ]
};

 // The provided learner submission data.
const LearnerSubmissions = [
   {
   learner_id: 125,
   assignment_id: 1,
   submission: {
       submitted_at: "2023-01-25",
       score: 47
       }
   },
   {
   learner_id: 125,
   assignment_id: 2,
   submission: {
       submitted_at: "2023-02-12",
       score: 150
       }
   },
   {
   learner_id: 125,
   assignment_id: 3,
   submission: {
       submitted_at: "2023-01-25",
       score: 400
       }
   },
   {
     learner_id: 132,
     assignment_id: 1,
     submission: {
       submitted_at: "2023-01-24",
       score: 39
     }
   },
   {
     learner_id: 132,
     assignment_id: 2,
     submission: {
       submitted_at: "2023-03-07",
       score: 140
     }
   }
   ];

   function getLearnerData(course, ag, submissions) {
      // here, we would process this data to achieve the desired result.
      const result = [
        {
          id: 125,
          avg: 0.985, // (47 + 150) / (50 + 150)
          1: 0.94, // 47 / 50
          2: 1.0 // 150 / 150
        },
        {
          id: 132,
          avg: 0.82, // (39 + 125) / (50 + 150)
          1: 0.78, // 39 / 50
          2: 0.833 // late: (140 - 15) / 150
        }
      ];
    
      return result;
    }



// Helper function to get the date base on string date, if no argument then return today date
function getDate(date) {
   let dateObj;
   if (date) {
       dateObj = new Date(date);
   }
   else {
       dateObj = new Date();
   }
   return dateObj;
}


// Helper function to get the points possible based on assignment id
function getPointsPossible(id, assignmentArr) {
   for (let index in assignmentArr) {
       let item = assignmentArr[index];

       if (id == item.id) {
           return item.points_possible;
       }
   }
   throw new Error('The points possible for this assignment ID cannot be found');
}

// Helper function to get the time due based on assignment id
function getDueTime(id, assignmentArr) {
   for (let index in assignmentArr) {
       let item = assignmentArr[index];

       if (id == item.id) {
           return item.due_at;
       }
   }
   throw new Error('The due time for this assignment ID cannot be found');
}

// Helper to get learner unique id (a set)
function getLearnerUniqueID (learnerSubmission) {
   const uniqueSet = new Set();
   for (let i=0; i < learnerSubmission.length; i++) {
       let learnerSubmissionObj = learnerSubmission[i];
       uniqueSet.add(learnerSubmissionObj['learner_id'])
       
   }
   return uniqueSet;
}

// Helper to get average score 
function getAverageScore(scoreObj) {
   const totalKeys = Object.keys(scoreObj).length;
   let totalPoints = 0;
   for (let key in scoreObj) {
       totalPoints += scoreObj[key];
   }
   return totalPoints/totalKeys;
}


// calculate based on the student ID, make a function to compile all the submitted assignments and score for each student ID, store it as an object, then use this info in the main function to process further.


function getLearnerScore(learnerID, learnerSubmission, assignmentArr) {
   // make a learnerData object to store all assignments submitted by one learner
   const learnerScoreObj = {};

    // read though the learnerSubmission array to record all the submissions under each learner id
   for (let index in learnerSubmission){
       let learnerSubmissionObj = learnerSubmission[index];

       if (learnerSubmissionObj['learner_id'] == learnerID) {
           let assignmentId = learnerSubmissionObj['assignment_id'];

           let learnerScore = learnerSubmissionObj['submission']['score'];
           let learnerSubmitTime = learnerSubmissionObj['submission']['submitted_at'];
           let isLate = false;

           let assignmentScore;
           try {
               assignmentScore = getPointsPossible(assignmentId, assignmentArr);
           } catch (error) {
               console.log(error);
           };

           if (assignmentScore < 0) {
               break;
           }

           let assignmentDueTime;
           try {
               assignmentDueTime = getDueTime(assignmentId, assignmentArr);
           } catch (error) {
               console.log(error);
               break;
           }

           // calculate score base on if submitted late or not
           let calculatedScore;
           if (assignmentDueTime < learnerSubmitTime) {
               isLate = true;
               calculatedScore = (learnerScore - assignmentScore*0.1)/assignmentScore;
           }
           else {
               calculatedScore = learnerScore/assignmentScore
           }
           learnerScoreObj[assignmentId] = calculatedScore;
       }
   }
   return learnerScoreObj;
}

// MAIN FUNCTION FOR FIRST APPROACH
function getLearnerData(courseInfo, assignmentGroup, learnerSubmission) {
   // throw an error if the course id do not match
   try {
       if (courseInfo['id'] !== assignmentGroup['course_id']) {
           throw new Error('The AssignmentGroup does not belong to this course, please check course ID and try again.');
       }        
   } catch (error) {
       return error; //this will end the program
   }
   
   const result = [];
   const allLearnerIds = getLearnerUniqueID(learnerSubmission);

   // iterate through the set to find all submission under each student ID
   allLearnerIds.forEach( (id) => {
       const learnerObj = getLearnerScore(id, learnerSubmission, assignmentGroup.assignments);
       learnerObj['avg'] = getAverageScore(learnerObj);
       learnerObj['id'] = id;
       result.push(learnerObj);
   } )
   return result;
}


const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log('Result of the whole program ')
console.log(result);


