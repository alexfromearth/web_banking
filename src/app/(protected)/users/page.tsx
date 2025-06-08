import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserList } from '@/components/user-list';
import { getUsersData } from '@/app/actions/user';

export default async function UsersPage() {
  const data = await getUsersData();

  if (!data) return null;

  const { currentUser, otherUsers } = data;

  return (
    <div className='container mx-auto py-8'>
      <Card className='w-full max-w-3xl mx-auto'>
        <CardHeader>
          <CardTitle>Users list</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList users={otherUsers} currentUser={currentUser} />
        </CardContent>
      </Card>
    </div>
  );
}
