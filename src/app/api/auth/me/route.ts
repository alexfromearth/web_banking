import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/kysely/with-auth';

export const GET = withAuth(async (_req, { user }) => {
  return NextResponse.json({ user: user });
});
