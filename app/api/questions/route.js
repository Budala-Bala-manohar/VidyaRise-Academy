import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');
const { getUser } = require('@/lib/auth');

export async function GET(request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const assessment_id = searchParams.get('assessment_id');
  if (!assessment_id) return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 });
  const db = getDb();
  const questions = db.prepare('SELECT * FROM questions WHERE assessment_id = ?').all(assessment_id);
  // For students taking the test, don't send correct answers
  if (user.role === 'student') {
    const sanitized = questions.map(({ correct_option, ...q }) => q);
    return NextResponse.json({ questions: sanitized });
  }
  return NextResponse.json({ questions });
}
