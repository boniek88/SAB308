const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    assignments: [
        {
            id: 1, name: "Declare a Variable", due_at: "2023-01-25", max_points: 50
        },
        {
            id: 2, name: "Write a Function", due_at: "2023-02-27", max_points: 150
        },
        {
            id: 3, name: "Code the World", due_at: "3156-11-15", max_points: 500     // 3156-11-15
        }
    ]
};

const LearnerSubmissions = [
    {
        student: 125, homework: 1, upload: { submitted_at: "2023-01-25", score: 47 }
    },
    {
        student: 125, homework: 2, upload: { submitted_at: "2023-02-12", score: 15 }  // 150
    },
    {
        student: 125, homework: 3, upload: { submitted_at: "2023-01-25", score: 400 }
    },
    {
        student: 132, homework: 1, upload: { submitted_at: "2023-01-24", score: 39 }
    },
    {
        student: 132, homework: 2, upload: { submitted_at: "2023-03-07", score: 140 }
    }
];

function getLearnerData(courseInfo, assignmentGroup, submissions) {
    const studentScores = {};

    // Loop through submissions using forEach
    submissions.forEach(submission => {
        try {
            const studentId = submission.student;
            const homeworkId = submission.homework;
            const score = submission.upload.score;

            // Find the assignment in the assignment group by its ID
            let assignment;
            for (let a of assignmentGroup.assignments) {
                if (a.id === homeworkId) {
                    assignment = a;
                    break; // Exit loop once the assignment is found
                }
            }
            if (!assignment) throw new Error(`Assignment not found for homework ID: ${homeworkId}`);
            
            const maxPoints = assignment.max_points;
            const dueDate = new Date(assignment.due_at);
            const startDate = new Date('2023-01-01');
            const endDate = new Date('2023-12-31');

            // Check if the due date exceeds class duration
            if (dueDate < startDate || dueDate > endDate) {
                throw new Error(`Due date is out of the acceptable range for homework ID: ${homeworkId}`);
            }

            const submittedDate = new Date(submission.upload.submitted_at);

            // Apply 10% deduction if the submission is late
            let finalScore = score;
            if (submittedDate > dueDate) {
                finalScore *= 0.9; // apply 10% deduction
            }

            const normalizedScore = finalScore / maxPoints;

            // Initialize the student's score record if it doesn't exist
            if (!studentScores[studentId]) {
                studentScores[studentId] = {
                    id: studentId,
                    totalScore: 0,
                    totalMaxPoints: 0,
                    homeworkScores: {}
                };
            }

            // Store the normalized score for the specific homework
            studentScores[studentId].homeworkScores[homeworkId] = normalizedScore;
            // Accumulate the total score and max points for the student
            studentScores[studentId].totalScore += finalScore;
            studentScores[studentId].totalMaxPoints += maxPoints;
        } catch (error) {
            console.error(`Error processing submission: ${JSON.stringify(submission)}`, error.message);
        }
    });

    // Use a traditional for loop to create the final result array, mapping student scores to their respective ids and averages
    const result = [];
    for (const student of Object.values(studentScores)) {
        const avg = student.totalScore / student.totalMaxPoints;
        result.push({
            courseName: courseInfo.name,
            assignmentName: assignmentGroup.name,
            learnerID: student.id,
            avg: avg,
            homework1: student.homeworkScores[1] || 0,
            homework2: student.homeworkScores[2] || 0,
            homework3: student.homeworkScores[3] || 0,
            passOrFail: avg >= 0.6 ? "pass" : "fail"  // Show pass or fail here if the avg is = or above .6
        });
    }

    return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
