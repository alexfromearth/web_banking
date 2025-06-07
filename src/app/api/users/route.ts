import { db } from '@/lib/db/db';
import { withAuth } from '@/lib/kysely/with-auth';
import { NextResponse } from 'next/server';

export const GET = withAuth(async (_req, { user: loggedInUser }) => {
  const users = await db
    .selectFrom('users')
    .where('id', '!=', loggedInUser.id as unknown as number)
    .select(['id', 'username', 'balance', 'currency'])
    .orderBy('balance', 'asc')
    .execute();

  return NextResponse.json(users);
});
