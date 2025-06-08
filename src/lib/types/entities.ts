import { UsersTable } from '@/lib/db/dbTypes';

export type User = Omit<UsersTable, 'id' | 'password_hash' | 'created_at'> & {
  id: number;
};
export type CurrentUser = Omit<UsersTable, 'id' | 'password_hash'> & {
  id: number;
};
