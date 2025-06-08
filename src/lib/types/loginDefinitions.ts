import { createTranslator, Messages } from 'next-intl';
import { z } from 'zod';

export const createLoginFormSchema = (t: ReturnType<typeof createTranslator<Messages, 'LoginPage'>>) =>
  z.object({
    username: z
      .string()
      .email()
      .min(4, { message: t('invalidUsername') }),
    password: z.string().min(8, { message: t('invalidPassword') }),
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
