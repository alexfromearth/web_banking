'use server';

import { redirect } from 'next/navigation';
import { verifySession } from '@/app/actions/auth/verifySession';
import { PropsWithChildren } from 'react';
import { Navbar } from '@/components/navbar';
import StoreProvider from '@/app/StoreProvider';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const user = await verifySession();

  if (!user) {
    redirect('/login');
  }

  return (
    <StoreProvider>
      <Navbar user={user} />
      {children}
    </StoreProvider>
  );
}
