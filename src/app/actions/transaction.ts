'use server';

import { revalidatePath } from 'next/cache';
import { convertCurrency } from '@/lib/utils/currency';
import { verifySession } from '@/app/actions/auth/verifySession';
import { dbInstance } from '@/lib/db/dbInstance';

export async function transferMoneyAction(targetUserId: number, amountInCents: number) {
  const currentUser = await verifySession();
  if (!currentUser) throw new Error('Not authenticated');
  if (amountInCents <= 0) throw new Error('Amount must be positive');
  if (currentUser.balance < amountInCents) throw new Error('Insufficient funds');

  try {
    await dbInstance.transaction().execute(async trx => {
      const targetUser = await trx
        .selectFrom('users')
        .where('id', '=', targetUserId)
        .select(['id', 'currency'])
        .executeTakeFirstOrThrow();

      const amountToDebit = amountInCents;
      const amountToCredit = convertCurrency(amountInCents, currentUser.currency, targetUser.currency);

      await trx
        .updateTable('users')
        .set(eb => ({
          balance: eb('balance', '-', amountToDebit),
        }))
        .where('id', '=', currentUser.id as unknown as number)
        .execute();

      await trx
        .updateTable('users')
        .set(eb => ({
          balance: eb('balance', '+', amountToCredit),
        }))
        .where('id', '=', targetUser.id)
        .execute();
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw new Error('Transaction failed.');
  }

  revalidatePath('/users');
}
