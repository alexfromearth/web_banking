import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { Currency } from '@/lib/db/dbTypes';

export type SessionData = IronSession<{
  user?: {
    id: number;
    username: string;
    balance: number;
    currency: Currency;
  };
  token: string;
}>;

export const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'web-banking-session',
  cookieOptions: {
    httpOnly: true,
  },
} satisfies SessionOptions;

export const getSession = async () => getIronSession<SessionData>(await cookies(), sessionOptions);
