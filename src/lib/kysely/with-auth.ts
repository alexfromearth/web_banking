import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './session';
import { db } from '../db/db';
import { UsersTable } from '@/lib/db/dbTypes';

type AuthenticatedUser = Omit<UsersTable, 'password_hash'>;

type AuthenticatedRouteHandler = (
  req: NextRequest,
  context: { user: AuthenticatedUser },
) => Promise<NextResponse> | NextResponse;

export const withAuth = (handler: AuthenticatedRouteHandler) => async (req: NextRequest) => {
  try {
    const session = await getSession();
    const token = session.token;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const dbSession = await db.selectFrom('sessions').where('session_token', '=', token).selectAll().executeTakeFirst();

    if (!dbSession || new Date(dbSession.expires_at) < new Date()) {
      session.destroy();
      return NextResponse.json({ message: 'Session expired or invalid' }, { status: 401 });
    }

    const user = await db
      .selectFrom('users')
      .where('id', '=', dbSession.user_id)
      .select(['id', 'username', 'balance', 'currency', 'created_at'])
      .executeTakeFirst();

    if (!user) {
      session.destroy();
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    return handler(req, { user: user as unknown as AuthenticatedUser });
  } catch (error) {
    console.error('Authentication error in withAuth wrapper:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
