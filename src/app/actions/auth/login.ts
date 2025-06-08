'use server';

import { dbInstance } from '@/lib/db/dbInstance';
import { comparePassword } from '@/lib/kysely/password';
import { getSession } from '@/lib/kysely/session';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { FormState, loginFormSchema } from '@/lib/types/loginDefinitions';

const WEEK = 7 * 24 * 60 * 60 * 1000;

export const login = async (_state: FormState, formData: FormData) => {
  try {
    const validatedFields = loginFormSchema.safeParse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { username, password } = validatedFields.data;

    const user = await dbInstance.selectFrom('users').where('username', '=', username).selectAll().executeTakeFirst();

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return { message: 'Invalid username or password' };
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiresAt = new Date(Date.now() + WEEK);

    await dbInstance
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
  } catch (error) {
    console.log({ error });
    throw { message: 'Internal Server Error' };
  }

  redirect('/users');
};
