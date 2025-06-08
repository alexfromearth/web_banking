'use server';

import { getSession } from '@/lib/kysely/session';
import { dbInstance } from '@/lib/db/dbInstance';
import { redirect } from 'next/navigation';

export const logout = async () => {
  try {
    const session = await getSession();

    if (session.token) {
      await dbInstance.deleteFrom('sessions').where('session_token', '=', session.token).execute();
    }

    session.destroy();
  } catch (error) {
    console.error('logout error', error);
  }

  redirect('/login');
};
