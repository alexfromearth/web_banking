import { User } from '@/lib/types/entities';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { convertCurrency, formatCurrency } from '@/lib/utils/currency';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TransferForm({
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
