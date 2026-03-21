import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { getUser } = require('@/lib/auth');

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const assessment_id = searchParams.get('assessment_id');

  let results;
  if (user.role === 'student') {
    results = db.prepare(`
      SELECT ar.*, a.title as assessment_title, a.type
      FROM assessment_results ar
      LEFT JOIN assessments a ON ar.assessment_id = a.id
      WHERE ar.student_id = ?
      ORDER BY ar.submitted_at DESC
    `).all(user.id);
  } else if (assessment_id) {
    results = db.prepare(`
      SELECT ar.*, u.name as student_name
      FROM assessment_results ar
      LEFT JOIN users u ON ar.student_id = u.id
      WHERE ar.assessment_id = ?
      ORDER BY ar.score DESC
    `).all(assessment_id);
  } else {
    results = db.prepare(`
      SELECT ar.*, u.name as student_name, a.title as assessment_title
      FROM assessment_results ar
      LEFT JOIN users u ON ar.student_id = u.id
      LEFT JOIN assessments a ON ar.assessment_id = a.id
      ORDER BY ar.submitted_at DESC
    `).all();
  }
  return NextResponse.json({ results });
}

export async function POST(request) {
  const user = await getUser();
  if (!user || user.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { assessment_id, answers } = await request.json();
  if (!assessment_id || !answers) return NextResponse.json({ error: 'Assessment ID and answers required' }, { status: 400 });

  const db = getDb();
  // Check if already submitted
  const existing = db.prepare('SELECT id FROM assessment_results WHERE assessment_id = ? AND student_id = ?').get(assessment_id, user.id);
  if (existing) return NextResponse.json({ error: 'Already submitted' }, { status: 409 });

  // Get correct answers and calculate score
  const questions = db.prepare('SELECT id, correct_option FROM questions WHERE assessment_id = ?').all(assessment_id);
  let score = 0;
  const total = questions.length;

  for (const q of questions) {
    if (answers[q.id] === q.correct_option) score++;
  }

  // Save result
  const result = db.prepare('INSERT INTO assessment_results (assessment_id, student_id, score, total) VALUES (?, ?, ?, ?)').run(assessment_id, user.id, score, total);

  // Save individual answers
  const insertAnswer = db.prepare('INSERT INTO student_answers (assessment_result_id, question_id, selected_option) VALUES (?, ?, ?)');
  for (const q of questions) {
    insertAnswer.run(result.lastInsertRowid, q.id, answers[q.id] || null);
  }

  return NextResponse.json({ score, total, percentage: Math.round((score / total) * 100) }, { status: 201 });
}
