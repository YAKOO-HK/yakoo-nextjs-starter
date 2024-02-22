'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm';
import { UserLoginSchema } from '@/types/user';

const AdminLoginForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  const [isPending, startTransition] = useTransition();
  const methods = useZodForm({
    zodSchema: UserLoginSchema,
    defaultValues: { username: '', password: '', type: 'admin' },
    onSubmit: async ({ username, password }) => {
      const result = await signIn('credentials', {
        username,
        password,
        type: 'admin',
        redirect: false,
      });
      if (result?.error) {
        methods.setError('password', { message: 'Invalid Username or Password.' });
      } else {
        startTransition(() => {
          router.refresh();
          router.replace(callbackUrl);
        });
      }
    },
  });
  const {
    control,
    formState: { isSubmitting },
  } = methods;
  return (
    <ZodForm {...methods}>
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <ControlledTextField control={control} name="username" label="Username" />
          <ControlledPasswordField control={control} name="password" label="Password" />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isPending}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </ZodForm>
  );
};

export { AdminLoginForm };
