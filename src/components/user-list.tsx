'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Currency } from '@/lib/db/dbTypes';
import { convertCurrency, formatCurrency } from '@/lib/utils/currency';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeTransferModal, openTransferModal } from '@/lib/redux/slices/modalSlice';
import { CurrentUser, User } from '@/lib/types/entities';
import { transferMoneyAction } from '@/app/actions/transaction';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { ArrowRightLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UserListProps {
  users: User[];
  currentUser: CurrentUser;
}

export function UserList({ users, currentUser }: UserListProps) {
  const t = useTranslations('TransferDialog');
  const dispatch = useAppDispatch();

  const { isTransferModalOpen, transferTargetUser } = useAppSelector(state => state.modals);

  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (
      state,
      {
        targetUserId,
        amountInCents,
        targetCurrency,
      }: {
        targetUserId: number;
        amountInCents: number;
        targetCurrency: Currency;
      },
    ) => {
      const amountToCredit = convertCurrency(amountInCents, currentUser.currency, targetCurrency);

      return state.map(user => {
        if (user.id === targetUserId) {
          return { ...user, balance: user.balance + amountToCredit };
        }
        if (user.id === currentUser.id) {
          return { ...user, balance: user.balance - amountInCents };
        }
        return user;
      });
    },
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      dispatch(closeTransferModal());
    }
  };

  async function handleTransfer(amountInCents: number) {
    if (!transferTargetUser) return;

    setOptimisticUsers({
      targetUserId: transferTargetUser.id,
      amountInCents,
      targetCurrency: transferTargetUser.currency,
    });

    try {
      await transferMoneyAction(transferTargetUser.id, amountInCents);
      dispatch(closeTransferModal());
      toast.success(t('toastSuccessTitle'), { description: t('toastSuccessDescription') });
    } catch (error) {
      toast.error(t('toastErrorTitle'), { description: (error as Error).message });
    }
  }

  const optimisticCurrentUser = optimisticUsers.find(u => u.id === currentUser.id) || currentUser;

  return (
    <>
      <div className='space-y-4'>
        {optimisticUsers.map(user => (
          <div key={user.id} className='flex items-center p-3 border-b'>
            <div className='flex items-center space-x-4'>
              <p className='text-sm font-medium leading-none'>{user.username}</p>
              <p className='text-sm text-muted-foreground'>{formatCurrency(user.balance, user.currency)}</p>
            </div>
            <div className='ml-auto'>
              <Button variant='default' className='h-8' onClick={() => dispatch(openTransferModal(user))}>
                <ArrowRightLeft className='h-4 w-4' />
                <span className='hidden sm:inline sm:ml-2'>{t('DialogTriggerText')}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isTransferModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('title', { username: transferTargetUser?.username ?? '' })}</DialogTitle>
          </DialogHeader>
          {transferTargetUser && (
            <TransferForm
              onSubmit={handleTransfer}
              currentUser={optimisticCurrentUser}
              targetUser={transferTargetUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function TransferForm({
  onSubmit,
  currentUser,
  targetUser,
}: {
  onSubmit: (amountInCents: number) => void;
  currentUser: User;
  targetUser: User;
}) {
  const t = useTranslations('TransferDialog');
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    amount: z.coerce
      .number()
      .gt(0, { message: t('gtError') })
      .max(currentUser.balance / 100, {
        message: t('maxError'),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      amount: 0,
    },
  });

  const amountValue = form.watch('amount');
  const convertedAmountInCents = convertCurrency(
    Math.round((amountValue || 0) * 100),
    currentUser.currency,
    targetUser.currency,
  );
  const showConversion = currentUser.currency !== targetUser.currency;

  const handleValidSubmit = (data: z.infer<typeof formSchema>) => {
    const amountInCents = Math.round(data.amount * 100);
    startTransition(() => {
      onSubmit(amountInCents);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleValidSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('amountLabel', { currency: currentUser.currency })}</FormLabel>
              <FormControl>
                <Input type='number' placeholder='0.00' step='0.01' min='0.01' disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showConversion && amountValue > 0 && !form.formState.errors.amount && (
          <p className='text-sm text-muted-foreground text-center'>
            {t('recipientWillReceive', { amount: formatCurrency(convertedAmountInCents, targetUser.currency) })}
          </p>
        )}

        <Button type='submit' className='w-full' disabled={isPending || !amountValue}>
          {isPending ? t('submitButtonSending') : t('submitButton')}
        </Button>
      </form>
    </Form>
  );
}
