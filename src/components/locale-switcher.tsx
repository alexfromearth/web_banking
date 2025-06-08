'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LocaleSwitcher() {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectLocale = (newLocale: 'ru' | 'en') => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' disabled={isPending}>
          <Languages className='h-[1.2rem] w-[1.2rem]' />
          <span className='sr-only'>Сменить язык</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem disabled={locale === 'ru'} onSelect={() => onSelectLocale('ru')}>
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem disabled={locale === 'en'} onSelect={() => onSelectLocale('en')}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
