import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { getUser } = require('@/lib/auth');

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();

  let assessments;
  if (user.role === 'student') {
    assessments = db.prepare(`
      SELECT a.*, u.name as trainer_name,
      (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) as question_count,
      (SELECT ar.id FROM assessment_results ar WHERE ar.assessment_id = a.id AND ar.student_id = ?) as result_id,
      (SELECT ar.score FROM assessment_results ar WHERE ar.assessment_id = a.id AND ar.student_id = ?) as score,
      (SELECT ar.total FROM assessment_results ar WHERE ar.assessment_id = a.id AND ar.student_id = ?) as total
      FROM assessments a
      LEFT JOIN users u ON a.trainer_id = u.id
      WHERE a.batch_id = ?
      ORDER BY a.created_at DESC
    `).all(user.id, user.id, user.id, user.batch_id);
  } else if (user.role === 'trainer') {
    assessments = db.prepare(`
      SELECT a.*, b.name as batch_name,
      (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) as question_count,
      (SELECT COUNT(*) FROM assessment_results ar WHERE ar.assessment_id = a.id) as attempts
      FROM assessments a
      LEFT JOIN batches b ON a.batch_id = b.id
      WHERE a.trainer_id = ?
      ORDER BY a.created_at DESC
    `).all(user.id);
  } else {
    assessments = db.prepare(`
      SELECT a.*, u.name as trainer_name, b.name as batch_name,
      (SELECT COUNT(*) FROM questions q WHERE q.assessment_id = a.id) as question_count,
      (SELECT COUNT(*) FROM assessment_results ar WHERE ar.assessment_id = a.id) as attempts
      FROM assessments a
      LEFT JOIN users u ON a.trainer_id = u.id
      LEFT JOIN batches b ON a.batch_id = b.id
      ORDER BY a.created_at DESC
    `).all();
  }
  return NextResponse.json({ assessments });
}

export async function POST(request) {
  const user = await getUser();
  if (!user || user.role !== 'trainer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, batch_id, type, duration_minutes, questions } = await request.json();
  if (!title || !batch_id || !type) return NextResponse.json({ error: 'Title, batch, and type required' }, { status: 400 });
  const db = getDb();
  const result = db.prepare('INSERT INTO assessments (title, trainer_id, batch_id, type, duration_minutes) VALUES (?, ?, ?, ?, ?)').run(title, user.id, batch_id, type, duration_minutes || 30);

  if (questions && questions.length > 0) {
    const insertQ = db.prepare('INSERT INTO questions (assessment_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const q of questions) {
      insertQ.run(result.lastInsertRowid, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option);
    }
  }
  return NextResponse.json({ id: result.lastInsertRowid, message: 'Assessment created' }, { status: 201 });
}
