import { NextResponse } from 'next/server';
import { getSession } from '@/lib/kysely/session';
import { db } from '@/lib/db/db';

export const POST = async () => {
  const session = await getSession();

  if (session.token) {
    await db.deleteFrom('sessions').where('session_token', '=', session.token).execute();
  }

  session.destroy();

  return NextResponse.json({ message: 'Logged out successfully' });
};
