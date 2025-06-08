import { Button } from './ui/button';
import { logout } from '@/app/actions/auth/logout';
import { formatCurrency } from '@/lib/utils/currency';
import { CurrentUser } from '@/lib/types/entities';
import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/locale-switcher';

interface Props {
  user: CurrentUser;
}

export const Navbar = async ({ user }: Props) => {
  const t = await getTranslations('Navbar');

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center'>
        <div className='flex items-center space-x-5'>
          <div className='flex flex-col ml-5'>
            <p className='text-sm pr-2'>{t('signedInAs')} </p>
            <p className='text-sm font-medium leading-none'>{user.username}</p>
          </div>
          <div className='flex'>
            <p className='text-sm pr-2'>{t('balance')} </p>
            <p className='text-sm text-muted-foreground'>{formatCurrency(user.balance, user.currency)}</p>
          </div>
        </div>

        <div className='ml-auto flex items-center space-x-2 mr-5'>
          <LocaleSwitcher />
          <form action={logout}>
            <Button type='submit' variant='default' size='sm'>
              {t('logoutButton')}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};
