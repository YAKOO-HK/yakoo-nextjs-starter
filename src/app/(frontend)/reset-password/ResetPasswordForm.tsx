'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import SuperJSON from 'superjson';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { ResetPasswordSchema } from '@/types/user';

export function ResetPasswordForm({ token, name }: { token: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
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
        toast({
          title: 'Success',
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
        <ControlledTextField
          control={control}
          name="password"
          label="Password"
          type="password"
          autoComplete="off"
          required
          className="bg-background"
        />
        <ControlledTextField
          control={control}
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
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
