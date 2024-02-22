'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import SuperJSON from 'superjson';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { ResetPasswordSchema } from '@/types/user';

export function ResetPasswordForm({ token, name }: { token: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const methods = useZodForm({
    zodSchema: ResetPasswordSchema,
    defaultValues: { token, password: '', passwordConfirmation: '' },
    onSubmit: async (data) => {
      await fetch('/api/reset-password', {
        body: SuperJSON.stringify(data),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(fetchResponseHandler());
      startTransition(() => {
        toast.success('Success', {
          description: 'Password has been updated. Please login with your new password.',
        });
        router.replace('/login');
      });
    },
  });
  const {
    control,
    formState: { isSubmitting },
  } = methods;

  return (
    <ZodForm {...methods}>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Hi {name}, please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ControlledPasswordField
          control={control}
          name="password"
          label="Password"
          autoComplete="off"
          required
          className="bg-background"
        />
        <ControlledPasswordField
          control={control}
          name="passwordConfirmation"
          label="Confirm Password"
          autoComplete="off"
          required
          className="bg-background"
        />
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isSubmitting || isPending} variant="secondary">
          {isSubmitting || isPending ? <Loader2Icon className="mr-2 size-4 animate-spin" /> : null}
          Save
        </Button>
      </CardFooter>
    </ZodForm>
  );
}
