import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { getUser } = require('@/lib/auth');

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const batch_id = searchParams.get('batch_id');

  let attendance;
  if (user.role === 'student') {
    attendance = db.prepare('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC').all(user.id);
  } else if (user.role === 'trainer') {
    let query = `SELECT a.*, u.name as student_name FROM attendance a LEFT JOIN users u ON a.student_id = u.id WHERE a.trainer_id = ?`;
    const params = [user.id];
    if (date) { query += ' AND a.date = ?'; params.push(date); }
    query += ' ORDER BY a.date DESC, u.name ASC';
    attendance = db.prepare(query).all(...params);
  } else {
    attendance = db.prepare(`
      SELECT a.*, u.name as student_name, t.name as trainer_name 
      FROM attendance a 
      LEFT JOIN users u ON a.student_id = u.id 
      LEFT JOIN users t ON a.trainer_id = t.id 
      ORDER BY a.date DESC
    `).all();
  }
  return NextResponse.json({ attendance });
}

export async function POST(request) {
  const user = await getUser();
  if (!user || user.role !== 'trainer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { records } = await request.json();
  if (!records || !records.length) return NextResponse.json({ error: 'Records required' }, { status: 400 });
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO attendance (student_id, trainer_id, date, status) VALUES (?, ?, ?, ?)
    ON CONFLICT DO NOTHING
  `);
  // Delete existing records for the date first, then insert new ones
  const date = records[0].date;
  db.prepare('DELETE FROM attendance WHERE trainer_id = ? AND date = ?').run(user.id, date);
  for (const r of records) {
    db.prepare('INSERT INTO attendance (student_id, trainer_id, date, status) VALUES (?, ?, ?, ?)').run(r.student_id, user.id, r.date, r.status);
  }
  return NextResponse.json({ message: 'Attendance saved' }, { status: 201 });
}
