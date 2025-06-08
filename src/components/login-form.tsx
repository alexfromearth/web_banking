'use client';

import { startTransition, useActionState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/app/actions/auth/login';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { loginFormSchema } from '@/lib/types/loginDefinitions';
import { Label } from '@radix-ui/react-label';
import { zodResolver } from '@hookform/resolvers/zod';

export function LoginForm() {
  const [formState, formAction, pending] = useActionState(login, undefined);

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors: rhfErrors },
  } = useForm<z.output<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
  });

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={event => {
            event.preventDefault();
            handleSubmit(() => {
              startTransition(() => formAction(new FormData(formRef.current!)));
            })(event);
          }}
          className='grid gap-4'
        >
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' placeholder='m@example.com' required {...register('username')} />
            {formState?.errors?.username && <p className='text-destructive'>{formState?.errors?.username.join()}</p>}
            {rhfErrors.username?.message && <p className='text-destructive'>{rhfErrors.username?.message}</p>}
          </div>
          <div className='grid gap-2'>
            <div className='flex items-center'>
              <Label htmlFor='password'>Password</Label>
            </div>
            <Input id='password' type='password' required {...register('password')} />
            {formState?.errors?.password && <p className='text-destructive'>{formState?.errors?.password.join()}</p>}
            {rhfErrors.password?.message && <p className='text-destructive'>{rhfErrors.password?.message}</p>}
            {formState?.message && <p className='text-destructive'>{formState?.message}</p>}
          </div>
          <Button type='submit' className='w-full' disabled={pending}>
            {pending ? 'Login in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
