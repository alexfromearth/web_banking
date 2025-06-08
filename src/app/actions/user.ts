'use server';

import { CurrentUser, User } from '@/lib/types/entities';
import { verifySession } from '@/app/actions/auth/verifySession';
import { dbInstance } from '@/lib/db/dbInstance';

export const getUsersData = async (): Promise<{ otherUsers: User[]; currentUser: CurrentUser } | null> => {
  const currentUser = await verifySession();

  if (!currentUser) return null;

  const otherUsers = await dbInstance
    .selectFrom('users')
    .where('id', '!=', currentUser.id as unknown as number)
    .select(['id', 'username', 'balance', 'currency'])
    .orderBy('username', 'asc')
    .execute();

  return { currentUser: currentUser as unknown as CurrentUser, otherUsers: otherUsers as unknown as User[] };
};
