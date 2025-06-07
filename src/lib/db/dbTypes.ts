import type { Generated } from 'kysely';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

export interface UsersTable {
  id: Generated<number>;
  username: string;
  password_hash: string;
  created_at: Generated<string>;
  balance: number;
  currency: Currency;
}

export interface DatabaseTables {
  users: UsersTable;
}
