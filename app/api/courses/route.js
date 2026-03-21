import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { requireAuth } = require('@/lib/auth');

export async function GET() {
  const auth = await requireAuth(['admin', 'trainer', 'student']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const db = getDb();
  const courses = db.prepare('SELECT * FROM courses ORDER BY created_at ASC').all();
  return NextResponse.json({ courses });
}

export async function POST(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  
  const { name } = await request.json();
  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Course name is required' }, { status: 400 });
  }

  const db = getDb();
  try {
    const result = db.prepare('INSERT INTO courses (name) VALUES (?)').run(name.trim());
    return NextResponse.json({ id: result.lastInsertRowid, message: 'Course created successfully', name: name.trim() }, { status: 201 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Course already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });

  const db = getDb();
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  return NextResponse.json({ message: 'Course deleted successfully' });
}
