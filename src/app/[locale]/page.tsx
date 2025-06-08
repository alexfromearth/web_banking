import { verifySession } from '@/app/actions/auth/verifySession';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

export default async function RootPage() {
  const user = await verifySession();
  const locale = await getLocale();

  if (user) {
    redirect({ href: '/users', locale });
  } else {
    redirect({ href: '/login', locale });
  }

  return null;
}
