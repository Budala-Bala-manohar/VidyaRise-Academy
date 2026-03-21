import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { getUser } = require('@/lib/auth');

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const batch_id = searchParams.get('batch_id');

  let assignments;
  if (user.role === 'student') {
    assignments = db.prepare(`
      SELECT a.*, u.name as trainer_name 
      FROM assignments a 
      LEFT JOIN users u ON a.trainer_id = u.id 
      WHERE a.batch_id = ? 
      ORDER BY a.created_at DESC
    `).all(user.batch_id);
  } else if (user.role === 'trainer') {
    assignments = db.prepare(`
      SELECT a.*, b.name as batch_name,
      (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) as submission_count
      FROM assignments a 
      LEFT JOIN batches b ON a.batch_id = b.id
      WHERE a.trainer_id = ? 
      ORDER BY a.created_at DESC
    `).all(user.id);
  } else {
    assignments = db.prepare(`
      SELECT a.*, u.name as trainer_name, b.name as batch_name 
      FROM assignments a 
      LEFT JOIN users u ON a.trainer_id = u.id 
      LEFT JOIN batches b ON a.batch_id = b.id 
      ORDER BY a.created_at DESC
    `).all();
  }
  return NextResponse.json({ assignments });
}

export async function POST(request) {
  const user = await getUser();
  if (!user || user.role !== 'trainer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, description, batch_id, due_date } = await request.json();
  if (!title || !batch_id) return NextResponse.json({ error: 'Title and batch required' }, { status: 400 });
  const db = getDb();
  const result = db.prepare('INSERT INTO assignments (title, description, trainer_id, batch_id, due_date) VALUES (?, ?, ?, ?, ?)').run(title, description, user.id, batch_id, due_date);
  return NextResponse.json({ id: result.lastInsertRowid, message: 'Assignment created' }, { status: 201 });
}
