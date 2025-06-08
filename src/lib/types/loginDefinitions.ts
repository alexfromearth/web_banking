import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().email().min(4, { message: 'Name must be at least 4 characters long.' }),
  password: z.string().min(8, { message: 'Be at least 8 characters long' }),
});

export type FormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
