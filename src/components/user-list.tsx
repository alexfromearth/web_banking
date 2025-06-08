'use client';

import { useOptimistic } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Currency } from '@/lib/db/dbTypes';
import { convertCurrency, formatCurrency } from '@/lib/utils/currency';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeTransferModal, openTransferModal } from '@/lib/redux/slices/modalSlice';
import { CurrentUser, User } from '@/lib/types/entities';
import { transferMoneyAction } from '@/app/actions/transaction';
import { ArrowRightLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import TransferForm from '@/components/transfer-form';

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
            <TransferForm onSubmit={handleTransfer} currentUser={currentUser} targetUser={transferTargetUser} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
