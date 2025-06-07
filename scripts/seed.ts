import { db } from '@/lib/db/db';
import { Currency } from '@/lib/db/dbTypes';
import { hashPassword } from '@/lib/kysely/password';

const seedUsers = [
  {
    username: 'test@test.com',
    password: 'supersecretpassword1',
    balance: 10000,
    currency: Currency.USD,
  },
  {
    username: 'test2@test.com',
    password: 'anotherstrongpassword2',
    balance: 5550,
    currency: Currency.EUR,
  },
];

async function seed() {
  console.log('Seeding database...');

  try {
    for (const userData of seedUsers) {
      const existingUser = await db
        .selectFrom('users')
        .where('username', '=', userData.username)
        .select('id')
        .executeTakeFirst();

      if (existingUser) {
        console.log(`- User "${userData.username}" already exists. Skipping.`);
        continue;
      }

      const password_hash = await hashPassword(userData.password);

      await db
        .insertInto('users')
        .values({
          username: userData.username,
          password_hash: password_hash,
          balance: userData.balance,
          currency: userData.currency,
        })
        .execute();

      console.log(`+ User "${userData.username}" created successfully.`);
    }

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await db.destroy();
  }
}

seed();
