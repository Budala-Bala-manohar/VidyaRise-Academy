const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'vidyarise.db');

// Delete existing DB to reseed
const fs = require('fs');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS batches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','trainer','student')),
    school_id INTEGER,
    batch_id INTEGER,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE SET NULL
  );
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    trainer_id INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    due_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    answer_text TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    marks INTEGER,
    feedback TEXT,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    trainer_id INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('weekly','monthly')),
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL CHECK(correct_option IN ('A','B','C','D')),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS assessment_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS student_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assessment_result_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    selected_option TEXT,
    FOREIGN KEY (assessment_result_id) REFERENCES assessment_results(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    trainer_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('present','absent','late')),
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed schools
const insertSchool = db.prepare('INSERT INTO schools (name, address, phone, email) VALUES (?, ?, ?, ?)');
insertSchool.run('VidyaRise Central Academy', '123 Knowledge Lane, Bangalore, Karnataka 560001', '+91 9876543210', 'central@vidyarise.com');
insertSchool.run('VidyaRise North Campus', '456 Learning Avenue, Delhi, 110001', '+91 9876543211', 'north@vidyarise.com');

// Seed batches
const insertBatch = db.prepare('INSERT INTO batches (school_id, name, start_date, end_date) VALUES (?, ?, ?, ?)');
insertBatch.run(1, 'Batch Alpha 2026', '2026-01-15', '2026-06-15');
insertBatch.run(1, 'Batch Beta 2026', '2026-02-01', '2026-07-01');
insertBatch.run(2, 'Batch Gamma 2026', '2026-03-01', '2026-08-01');

// Seed users
const insertUser = db.prepare('INSERT INTO users (name, email, password_hash, role, school_id, batch_id, phone) VALUES (?, ?, ?, ?, ?, ?, ?)');
const adminHash = bcrypt.hashSync('admin123', 10);
const trainerHash = bcrypt.hashSync('trainer123', 10);
const studentHash = bcrypt.hashSync('student123', 10);

insertUser.run('Admin User', 'admin@vidyarise.com', adminHash, 'admin', 1, null, '+91 9000000001');
insertUser.run('Priya Sharma', 'trainer@vidyarise.com', trainerHash, 'trainer', 1, null, '+91 9000000002');
insertUser.run('Rahul Kumar', 'student@vidyarise.com', studentHash, 'student', 1, 1, '+91 9000000003');
insertUser.run('Anita Desai', 'trainer2@vidyarise.com', trainerHash, 'trainer', 1, null, '+91 9000000004');
insertUser.run('Vikram Singh', 'student2@vidyarise.com', studentHash, 'student', 1, 1, '+91 9000000005');
insertUser.run('Meera Patel', 'student3@vidyarise.com', studentHash, 'student', 1, 2, '+91 9000000006');
insertUser.run('Arjun Nair', 'student4@vidyarise.com', studentHash, 'student', 2, 3, '+91 9000000007');

// Seed assignments
const insertAssignment = db.prepare('INSERT INTO assignments (title, description, trainer_id, batch_id, due_date) VALUES (?, ?, ?, ?, ?)');
insertAssignment.run('Mathematics: Algebra Basics', 'Complete exercises 1-20 from Chapter 3. Show all steps.', 2, 1, '2026-03-20');
insertAssignment.run('Science: Chemical Reactions', 'Write a lab report on the acid-base experiment conducted in class.', 2, 1, '2026-03-22');
insertAssignment.run('English: Essay Writing', 'Write a 500-word essay on "The Impact of Technology on Education".', 2, 1, '2026-03-25');
insertAssignment.run('History: Ancient Civilizations', 'Create a timeline of major events in the Indus Valley Civilization.', 4, 2, '2026-03-23');

// Seed submissions
const insertSubmission = db.prepare('INSERT INTO submissions (assignment_id, student_id, answer_text, marks, feedback) VALUES (?, ?, ?, ?, ?)');
insertSubmission.run(1, 3, 'Completed all 20 exercises. Please find my solutions attached.', 85, 'Excellent work! Minor errors in Q15 and Q18.');
insertSubmission.run(2, 3, 'Lab report on acid-base titration experiment.', 78, 'Good observations. Add more detail to the conclusion.');
insertSubmission.run(1, 5, 'My solutions for algebra exercises.', 72, 'Good effort. Review factoring techniques.');

// Seed assessments
const insertAssessment = db.prepare('INSERT INTO assessments (title, trainer_id, batch_id, type, duration_minutes) VALUES (?, ?, ?, ?, ?)');
insertAssessment.run('Weekly Math Quiz - Week 10', 2, 1, 'weekly', 15);
insertAssessment.run('Monthly Science Test - March', 2, 1, 'monthly', 45);

// Seed questions for assessment 1
const insertQuestion = db.prepare('INSERT INTO questions (assessment_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)');
insertQuestion.run(1, 'What is the value of x in: 2x + 6 = 14?', '2', '4', '6', '8', 'B');
insertQuestion.run(1, 'Simplify: 3(x + 2) - x', '2x + 6', '3x + 6', '2x + 2', '4x + 6', 'A');
insertQuestion.run(1, 'What is the slope of y = 3x + 5?', '5', '3', '8', '1', 'B');
insertQuestion.run(1, 'Factor: x² - 9', '(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x+9)(x-1)', 'A');
insertQuestion.run(1, 'Solve: |x - 3| = 7', 'x = 10 or x = -4', 'x = 4 or x = -10', 'x = 10 or x = 4', 'x = -4 or x = -10', 'A');

// Seed questions for assessment 2
insertQuestion.run(2, 'What is the chemical formula for water?', 'H2O2', 'HO', 'H2O', 'OH2', 'C');
insertQuestion.run(2, 'Which gas is essential for combustion?', 'Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Hydrogen', 'B');
insertQuestion.run(2, 'What is the pH of a neutral solution?', '0', '7', '14', '1', 'B');
insertQuestion.run(2, 'Which element has atomic number 6?', 'Nitrogen', 'Oxygen', 'Carbon', 'Boron', 'C');
insertQuestion.run(2, 'What type of reaction is: 2H2 + O2 → 2H2O?', 'Decomposition', 'Single Replacement', 'Synthesis', 'Double Replacement', 'C');

// Seed assessment results
const insertResult = db.prepare('INSERT INTO assessment_results (assessment_id, student_id, score, total) VALUES (?, ?, ?, ?)');
insertResult.run(1, 3, 4, 5);
insertResult.run(1, 5, 3, 5);

// Seed attendance
const insertAttendance = db.prepare('INSERT INTO attendance (student_id, trainer_id, date, status) VALUES (?, ?, ?, ?)');
const dates = ['2026-03-10', '2026-03-11', '2026-03-12', '2026-03-13', '2026-03-14'];
dates.forEach(date => {
  insertAttendance.run(3, 2, date, 'present');
  insertAttendance.run(5, 2, date, date === '2026-03-12' ? 'absent' : 'present');
  insertAttendance.run(6, 2, date, date === '2026-03-14' ? 'late' : 'present');
});

console.log('✅ Database seeded successfully!');
console.log('   Schools: 2');
console.log('   Batches: 3');
console.log('   Users: 7 (1 admin, 2 trainers, 4 students)');
console.log('   Assignments: 4');
console.log('   Submissions: 3');
console.log('   Assessments: 2 (10 questions total)');
console.log('   Assessment Results: 2');
console.log('   Attendance Records: 15');
console.log('');
console.log('   Demo Credentials:');
console.log('   Admin:   admin@vidyarise.com / admin123');
console.log('   Trainer: trainer@vidyarise.com / trainer123');
console.log('   Student: student@vidyarise.com / student123');

db.close();
