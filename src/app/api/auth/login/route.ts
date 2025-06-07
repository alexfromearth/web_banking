import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/db';
import { comparePassword } from '@/lib/kysely/password';
import { getSession } from '@/lib/kysely/session';
import crypto from 'crypto';

const WEEK = 7 * 24 * 60 * 60 * 1000;

const loginSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    const user = await db.selectFrom('users').where('username', '=', username).selectAll().executeTakeFirst();

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = new Date(Date.now() + WEEK);

    await db
      .insertInto('sessions')
      .values({
        session_token: sessionToken,
        user_id: user.id,
        expires_at: sessionExpiresAt.toISOString(),
      })
      .execute();

    const session = await getSession();
    session.token = sessionToken;
    await session.save();

    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};
