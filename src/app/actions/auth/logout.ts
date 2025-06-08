'use server';
import { getLocale } from 'next-intl/server';

import { getSession } from '@/lib/kysely/session';
import { dbInstance } from '@/lib/db/dbInstance';
import { redirect } from '@/i18n/navigation';

export const logout = async () => {
  const locale = await getLocale();

  try {
    const session = await getSession();

    if (session.token) {
      await dbInstance.deleteFrom('sessions').where('session_token', '=', session.token).execute();
    }

    session.destroy();
  } catch (error) {
    console.error('logout error', error);
  }

  redirect({
    locale,
    href: '/login',
  });
};
