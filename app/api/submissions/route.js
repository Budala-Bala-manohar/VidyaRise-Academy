import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { getUser } = require('@/lib/auth');

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const assignment_id = searchParams.get('assignment_id');

  let submissions;
  if (user.role === 'student') {
    if (assignment_id) {
      submissions = db.prepare('SELECT * FROM submissions WHERE student_id = ? AND assignment_id = ?').all(user.id, assignment_id);
    } else {
      submissions = db.prepare(`
        SELECT s.*, a.title as assignment_title 
        FROM submissions s 
        LEFT JOIN assignments a ON s.assignment_id = a.id 
        WHERE s.student_id = ? 
        ORDER BY s.submitted_at DESC
      `).all(user.id);
    }
  } else {
    if (assignment_id) {
      submissions = db.prepare(`
        SELECT s.*, u.name as student_name 
        FROM submissions s 
        LEFT JOIN users u ON s.student_id = u.id 
        WHERE s.assignment_id = ? 
        ORDER BY s.submitted_at DESC
      `).all(assignment_id);
    } else {
      submissions = db.prepare(`
        SELECT s.*, u.name as student_name, a.title as assignment_title 
        FROM submissions s 
        LEFT JOIN users u ON s.student_id = u.id 
        LEFT JOIN assignments a ON s.assignment_id = a.id 
        ORDER BY s.submitted_at DESC
      `).all();
    }
  }
  return NextResponse.json({ submissions });
}

export async function POST(request) {
  const user = await getUser();
  if (!user || user.role !== 'student') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { assignment_id, answer_text } = await request.json();
  if (!assignment_id || !answer_text) return NextResponse.json({ error: 'Assignment ID and answer required' }, { status: 400 });
  const db = getDb();
  const existing = db.prepare('SELECT id FROM submissions WHERE student_id = ? AND assignment_id = ?').get(user.id, assignment_id);
  if (existing) return NextResponse.json({ error: 'Already submitted' }, { status: 409 });
  const result = db.prepare('INSERT INTO submissions (assignment_id, student_id, answer_text) VALUES (?, ?, ?)').run(assignment_id, user.id, answer_text);
  return NextResponse.json({ id: result.lastInsertRowid, message: 'Submitted successfully' }, { status: 201 });
}

export async function PUT(request) {
  const user = await getUser();
  if (!user || user.role !== 'trainer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, marks, feedback } = await request.json();
  if (!id) return NextResponse.json({ error: 'Submission ID required' }, { status: 400 });
  const db = getDb();
  db.prepare('UPDATE submissions SET marks = ?, feedback = ? WHERE id = ?').run(marks, feedback, id);
  return NextResponse.json({ message: 'Graded successfully' });
}
