import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const batch_id = searchParams.get('batch_id');

  let materials;
  if (user.role === 'student') {
    materials = db.prepare(`
      SELECT m.*, u.name as trainer_name 
      FROM materials m 
      LEFT JOIN users u ON m.trainer_id = u.id 
      WHERE m.batch_id = ? OR m.school_id = ?
      ORDER BY m.created_at DESC
    `).all(user.batch_id, user.school_id);
  } else if (user.role === 'trainer') {
    materials = db.prepare(`
      SELECT m.*, b.name as batch_name, s.name as school_name 
      FROM materials m 
      LEFT JOIN batches b ON m.batch_id = b.id
      LEFT JOIN schools s ON m.school_id = s.id
      WHERE m.trainer_id = ? 
      ORDER BY m.created_at DESC
    `).all(user.id);
  } else {
    materials = db.prepare(`
      SELECT m.*, u.name as trainer_name, b.name as batch_name, s.name as school_name 
      FROM materials m 
      LEFT JOIN users u ON m.trainer_id = u.id 
      LEFT JOIN batches b ON m.batch_id = b.id 
      LEFT JOIN schools s ON m.school_id = s.id
      ORDER BY m.created_at DESC
    `).all();
  }
  return NextResponse.json({ materials });
}

export async function POST(request) {
  const user = await getUser();
  if (!user || user.role !== 'trainer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.formData();
    const file = data.get('file');
    const title = data.get('title');
    const description = data.get('description');
    const batch_id = data.get('batch_id') || null;
    const school_id = data.get('school_id') || null;

    if (!file || !title || (!batch_id && !school_id)) {
      return NextResponse.json({ error: 'File, title, and either batch or school are required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/materials directory
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'materials');
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    const dbFilePath = `/uploads/materials/${fileName}`;

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO materials (title, description, file_path, file_type, trainer_id, batch_id, school_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, dbFilePath, file.type, user.id, batch_id, school_id);

    return NextResponse.json({ id: result.lastInsertRowid, message: 'Material uploaded successfully' }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getUser();
  if (!user || user.role !== 'trainer') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Material ID required' }, { status: 400 });

  const db = getDb();
  
  const material = db.prepare('SELECT trainer_id FROM materials WHERE id = ?').get(id);
  if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  if (material.trainer_id !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  db.prepare('DELETE FROM materials WHERE id = ?').run(id);
  
  return NextResponse.json({ message: 'Material deleted successfully' });
}
