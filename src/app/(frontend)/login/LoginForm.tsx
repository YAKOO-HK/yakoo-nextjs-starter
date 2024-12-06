'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm';
import { UserLoginSchema, type UserLoginFormData } from '@/types/user';

const UserLoginWithTotpSchema = UserLoginSchema.extend({ totp: z.string().trim().min(1, { message: 'Required.' }) });
export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isPendingTransition, startTransition] = useTransition();
  const [showTotp, setShowTotp] = useState(false);
  const methods = useZodForm({
    zodSchema: showTotp ? UserLoginWithTotpSchema : UserLoginSchema,
    defaultValues: {
      username: '',
      password: '',
      totp: '',
      type: 'frontend',
    } satisfies UserLoginFormData,
    onSubmit: async ({ username, password, totp }) => {
      const result = await signIn('credentials', {
        type: 'frontend',
        username,
        password,
        totp,
        redirect: false,
        callbackUrl,
      });
      if (!result) {
        methods.setError('password', { message: 'System Error. Please try again later' });
        return;
      }
      // console.log(result);
      if (result.ok && !result.error) {
        startTransition(() => {
          router.refresh();
          router.replace(callbackUrl);
        });
        return;
      }

      if (result.code === 'otp-required') {
        setShowTotp(true);
      } else if (result.code === 'invalid-otp') {
        methods.setError('totp', { message: 'Invalid OTP.' });
      } else {
        methods.setError('password', { message: 'Invalid email or password.' });
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
          {showTotp ? (
            <div className="space-y-4">
              <p>Please enter the 6-digit One-Time Passcode(OTP) to proceed.</p>
              <ControlledTextField
                key="totp"
                control={control}
                label="One-time Passcode"
                name="totp"
                placeholder="******"
                autoComplete="off"
                className="text-center text-lg font-medium tabular-nums tracking-[0.2rem] md:text-xl"
                maxLength={6}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <ControlledTextField control={control} label="Username" name="username" />
              <ControlledPasswordField control={control} label="Password" name="password" />
            </div>
          )}
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
