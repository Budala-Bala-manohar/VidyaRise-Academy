import { NextResponse } from 'next/server';
const bcrypt = require('bcryptjs');
const { getDb } = require('@/lib/db');
const { requireAuth } = require('@/lib/auth');

export async function GET(request) {
  const auth = await requireAuth(['admin', 'trainer']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const db = getDb();
  let query = `SELECT u.id, u.name, u.email, u.role, u.phone, u.school_id, u.batch_id, u.created_at,
               s.name as school_name, b.name as batch_name
               FROM users u
               LEFT JOIN schools s ON u.school_id = s.id
               LEFT JOIN batches b ON u.batch_id = b.id`;
  const params = [];
  if (role) { query += ' WHERE u.role = ?'; params.push(role); }
  query += ' ORDER BY u.created_at DESC';
  const users = db.prepare(query).all(...params);
  return NextResponse.json({ users });
}

export async function POST(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { name, email, password, role, school_id, batch_id, phone } = await request.json();
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
  }
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password_hash, role, school_id, batch_id, phone) VALUES (?, ?, ?, ?, ?, ?, ?)').run(name, email, hash, role, school_id || null, batch_id || null, phone || null);
  return NextResponse.json({ id: result.lastInsertRowid, message: 'User created' }, { status: 201 });
}

export async function DELETE(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  return NextResponse.json({ message: 'User deleted' });
}
