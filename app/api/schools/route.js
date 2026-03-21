import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { requireAuth } = require('@/lib/auth');

export async function GET() {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const db = getDb();
  const schools = db.prepare('SELECT * FROM schools ORDER BY created_at DESC').all();
  return NextResponse.json({ schools });
}

export async function POST(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { name, address, phone, email } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  const db = getDb();
  const result = db.prepare('INSERT INTO schools (name, address, phone, email) VALUES (?, ?, ?, ?)').run(name, address, phone, email);
  return NextResponse.json({ id: result.lastInsertRowid, message: 'School created' }, { status: 201 });
}
