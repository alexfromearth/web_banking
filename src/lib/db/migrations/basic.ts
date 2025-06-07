import { Kysely, sql } from 'kysely';
import { DatabaseTables } from '@/lib/db/dbTypes';

export async function up(db: Kysely<DatabaseTables>): Promise<void> {
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
}

export async function down(db: Kysely<DatabaseTables>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
