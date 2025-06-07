import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { DatabaseTables } from '@/lib/db/dbTypes';

const dialect = new SqliteDialect({
  database: new Database('db.sqlite'),
});

export const db = new Kysely<DatabaseTables>({
  dialect,
});
