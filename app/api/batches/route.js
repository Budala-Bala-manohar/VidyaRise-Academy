import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { requireAuth } = require('@/lib/auth');

export async function GET() {
  const auth = await requireAuth(['admin', 'trainer']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const db = getDb();
  const batches = db.prepare(`
    SELECT b.*, s.name as school_name 
    FROM batches b 
    LEFT JOIN schools s ON b.school_id = s.id 
    ORDER BY b.created_at DESC
  `).all();
  return NextResponse.json({ batches });
}

export async function POST(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { school_id, name, start_date, end_date } = await request.json();
  if (!school_id || !name) return NextResponse.json({ error: 'School and name required' }, { status: 400 });
  const db = getDb();
  const result = db.prepare('INSERT INTO batches (school_id, name, start_date, end_date) VALUES (?, ?, ?, ?)').run(school_id, name, start_date, end_date);
  return NextResponse.json({ id: result.lastInsertRowid, message: 'Batch created' }, { status: 201 });
}
