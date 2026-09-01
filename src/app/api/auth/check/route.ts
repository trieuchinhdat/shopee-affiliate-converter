import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  const isAuthenticated = session?.value === 'authenticated';
  return NextResponse.json({ authenticated: isAuthenticated });
}
