const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Simple data structure to store grades
const gradesData = {
  '1111-1293': { studentID: '1111', subjectID: '1293', grade: 'A' },
  '1112-1293': { studentID: '1112', subjectID: '1293', grade: 'B' },
  '1113-1293': { studentID: '1113', subjectID: '1293', grade: 'C' },
};

// Prompt user for input
rl.question('Enter student ID: ', (studentID) => {
  rl.question('Enter subject ID: ', (subjectID) => {
    const grade = getGrade({ studentID, subjectID });
    console.log(`Student: ${studentID}, Grade: ${grade.grade}`);
    rl.close();
  });
});

function getGrade(grade) {
  return lookupGradeInData(grade);
}

function lookupGradeInData(grade) {
  const key = `${grade.studentID}-${grade.subjectID}`;
  return gradesData[key] || { message: 'Student grade not found' };
}