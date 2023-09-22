'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm';
import { UserLoginSchema, type UserLoginFormData } from '@/types/user';

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isPendingTransition, startTransition] = useTransition();
  const methods = useZodForm({
    zodSchema: UserLoginSchema,
    defaultValues: {
      username: '',
      password: '',
      type: 'frontend',
    } satisfies UserLoginFormData,
    onSubmit: async ({ username, password }) => {
      const result = await signIn('credentials', {
        username,
        password,
        type: 'frontend',
        redirect: false,
      });
      if (result?.error) {
        methods.setError('password', { message: 'Invalid email or password.' });
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
          <CardTitle>Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ControlledTextField control={control} label="Username" name="username" />
            <ControlledTextField control={control} label="Password" name="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isPendingTransition}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </ZodForm>
  );
}
