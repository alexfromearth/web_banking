import { redirect } from 'next/navigation';
import { verifySession } from '@/app/actions/auth/verifySession';

export default async function RootPage() {
  const user = await verifySession();

  if (user) {
    redirect('/users');
  } else {
    redirect('/login');
  }

  return null;
}
