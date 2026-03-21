import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { requireAuth } = require('@/lib/auth');

export async function GET(request) {
  const auth = await requireAuth('admin');
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'users';
  const db = getDb();

  let csv = '';
  if (type === 'users') {
    const users = db.prepare('SELECT u.name, u.email, u.role, u.phone, s.name as school, b.name as batch FROM users u LEFT JOIN schools s ON u.school_id = s.id LEFT JOIN batches b ON u.batch_id = b.id ORDER BY u.role, u.name').all();
    csv = 'Name,Email,Role,Phone,School,Batch\n' + users.map(u => `"${u.name}","${u.email}","${u.role}","${u.phone || ''}","${u.school || ''}","${u.batch || ''}"`).join('\n');
  } else if (type === 'performance') {
    const results = db.prepare(`
      SELECT u.name as student, a.title as assessment, ar.score, ar.total, 
      ROUND(ar.score * 100.0 / ar.total, 1) as percentage, ar.submitted_at
      FROM assessment_results ar 
      LEFT JOIN users u ON ar.student_id = u.id 
      LEFT JOIN assessments a ON ar.assessment_id = a.id 
      ORDER BY ar.submitted_at DESC
    `).all();
    csv = 'Student,Assessment,Score,Total,Percentage,Date\n' + results.map(r => `"${r.student}","${r.assessment}",${r.score},${r.total},${r.percentage}%,"${r.submitted_at}"`).join('\n');
  } else if (type === 'attendance') {
    const records = db.prepare(`
      SELECT u.name as student, t.name as trainer, a.date, a.status 
      FROM attendance a 
      LEFT JOIN users u ON a.student_id = u.id 
      LEFT JOIN users t ON a.trainer_id = t.id 
      ORDER BY a.date DESC
    `).all();
    csv = 'Student,Trainer,Date,Status\n' + records.map(r => `"${r.student}","${r.trainer}","${r.date}","${r.status}"`).join('\n');
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}_report.csv"`,
    },
  });
}
