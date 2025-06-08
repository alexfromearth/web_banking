import { Button } from './ui/button';
import { logout } from '@/app/actions/auth/logout';
import { formatCurrency } from '@/lib/utils/currency';
import { CurrentUser } from '@/lib/types/entities';

interface Props {
  user: CurrentUser;
}

export const Navbar = ({ user }: Props) => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center'>
        <div className='flex items-center space-x-3'>
          <div className='flex flex-col space-y-1 ml-6'>
            <p className='text-sm font-medium leading-none'>{user.username}</p>
          </div>
          <div className='flex'>
            <p className='text-sm pr-2'>Balance: </p>
            <p className='text-sm text-muted-foreground'>{formatCurrency(user.balance, user.currency)}</p>
          </div>
        </div>

        <div className='ml-auto'>
          <form action={logout}>
            <Button type='submit' variant='default' size='sm' className='mx-4'>
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};
