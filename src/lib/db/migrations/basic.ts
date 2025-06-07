import { Kysely, sql } from 'kysely';
import { DatabaseTables } from '@/lib/db/dbTypes';

export async function up(db: Kysely<DatabaseTables>): Promise<void> {
  try {
    await db.schema
      .createTable('users')
      .ifNotExists()
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('username', 'text', col => col.notNull().unique())
      .addColumn('password_hash', 'text', col => col.notNull())
      .addColumn('balance', 'integer', col => col.notNull().defaultTo(0))
      .addColumn('currency', 'text', col => col.notNull().check(sql`currency IN ('USD', 'EUR')`))
      .addColumn('created_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .execute();

    await db.schema
      .createTable('sessions')
      .ifNotExists()
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('session_token', 'text', col => col.notNull().unique())
      .addColumn('user_id', 'integer', col => col.references('users.id').onDelete('cascade').notNull())
      .addColumn('expires_at', 'text', col => col.notNull())
      .execute();

    await db.schema.createIndex('sessions_token_index').ifNotExists().on('sessions').column('session_token').execute();
  } catch (error) {
    console.error(error);
  }
}

export async function down(db: Kysely<DatabaseTables>): Promise<void> {
  await db.schema.dropTable('sessions').ifExists().execute();
  await db.schema.dropTable('users').execute();
}
