'use server';

import { cache } from 'react';
import { getSession } from '@/lib/kysely/session';
import { dbInstance } from '@/lib/db/dbInstance';
import { CurrentUser } from '@/lib/types/entities';

export const verifySession = cache(async (): Promise<CurrentUser | null> => {
  try {
    const session = await getSession();
    const token = session.token;

    if (!token) {
      return null;
    }

    const dbSession = await dbInstance
      .selectFrom('sessions')
      .where('session_token', '=', token)
      .selectAll()
      .executeTakeFirst();

    if (!dbSession || new Date(dbSession.expires_at) < new Date()) {
      return null;
    }

    const user = await dbInstance
      .selectFrom('users')
      .where('id', '=', dbSession.user_id)
      .select(['id', 'username', 'balance', 'currency', 'created_at'])
      .executeTakeFirst();

    return (user as unknown as CurrentUser) || null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
});
