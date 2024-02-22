'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import SuperJSON from 'superjson';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { ResetPasswordSchema } from '@/types/user';

const AdminResetPasswordForm = ({ token, name }: { token: string; name: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const methods = useZodForm({
    zodSchema: ResetPasswordSchema,
    defaultValues: { token, password: '', passwordConfirmation: '' },
    onSubmit: async (data) => {
      await fetch('/api/admin/reset-password', {
        body: SuperJSON.stringify(data),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(fetchResponseHandler());
      startTransition(() => {
        toast.success('Success', {
          description: 'Password has been updated. Please login with your new password.',
        });
        router.replace('/admin/login');
      });
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Hi {name},<br />
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <ControlledPasswordField control={control} name="password" label="Password" autoComplete="off" required />
          <ControlledTextField
            control={control}
            name="passwordConfirmation"
            label="Confirm Password"
            autoComplete="off"
            required
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isPending}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </ZodForm>
  );
};

export { AdminResetPasswordForm };
