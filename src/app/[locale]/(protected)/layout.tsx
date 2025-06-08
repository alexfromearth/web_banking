'use server';

import { verifySession } from '@/app/actions/auth/verifySession';
import { PropsWithChildren } from 'react';
import { Navbar } from '@/components/navbar';
import StoreProvider from '@/app/StoreProvider';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const user = await verifySession();
  const locale = await getLocale();

  if (!user) {
    redirect({
      locale,
      href: '/login',
    });
    return;
  }

  return (
    <StoreProvider>
      <Navbar user={user} />
      {children}
    </StoreProvider>
  );
}
