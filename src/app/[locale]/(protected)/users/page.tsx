import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserList } from '@/components/user-list';
import { getUsersData } from '@/app/actions/user';
import { getTranslations } from 'next-intl/server';

export default async function UsersPage() {
  const data = await getUsersData();
  const t = await getTranslations('UsersPage');

  if (!data) return null;

  const { currentUser, otherUsers } = data;

  return (
    <div className='container mx-auto py-8'>
      <Card className='w-full max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList users={otherUsers} currentUser={currentUser} />
        </CardContent>
      </Card>
    </div>
  );
}
