import { dbInstance } from '@/lib/db/dbInstance';
import { Currency } from '@/lib/db/dbTypes';
import { hashPassword } from '@/lib/kysely/password';

const seedUsers = [
  {
    username: 'test@test.com',
    password: 'test',
    balance: 10000000,
    currency: Currency.USD,
  },
  {
    username: 'test2@test.com',
    password: 'test',
    balance: 666000,
    currency: Currency.EUR,
  },
  {
    username: 'test3@test.com',
    password: 'test',
    balance: 555000,
    currency: Currency.USD,
  },
  {
    username: 'test4@test.com',
    password: 'test',
    balance: 444000,
    currency: Currency.EUR,
  },
  {
    username: 'test5@test.com',
    password: 'test',
    balance: 333000,
    currency: Currency.USD,
  },
];

async function seed() {
  console.log('Seeding database...');

  try {
    for (const userData of seedUsers) {
      const existingUser = await dbInstance
        .selectFrom('users')
        .where('username', '=', userData.username)
        .select('id')
        .executeTakeFirst();

      if (existingUser) {
        console.log(`- User "${userData.username}" already exists. Skipping.`);
        continue;
      }

      const password_hash = await hashPassword(userData.password);

      await dbInstance
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
    await dbInstance.destroy();
  }
}

seed();
