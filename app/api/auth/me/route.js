import { NextResponse } from 'next/server';
const { getUser } = require('@/lib/auth');

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({ user });
}
