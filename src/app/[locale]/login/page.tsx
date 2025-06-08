import { LocaleSwitcher } from '@/components/locale-switcher';
import { LoginForm } from '@/components/login-form';

export default function Page() {
  return (
    <div className='relative flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='absolute top-4 right-4 md:top-6 md:right-6'>
        <LocaleSwitcher />
      </div>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
