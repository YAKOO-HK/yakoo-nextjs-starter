'use client';

import SuperJSON from 'superjson';
import { ControlledPasswordField } from '@/components/form/ControlledPasswordField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { ChangePasswordSchema } from '@/types/user';

const EMPTY_FORM = { currentPassword: '', password: '', passwordConfirmation: '' };

function ChangePasswordForm({ className }: { className?: string }) {
  const { toast } = useToast();
  const methods = useZodForm({
    zodSchema: ChangePasswordSchema,
    defaultValues: EMPTY_FORM,
    onSubmit: async (values) => {
      // console.log(values);
      await fetch('/api/admin/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: SuperJSON.stringify(values),
      }).then(fetchResponseHandler());
      toast({ description: 'Password updated.', title: 'Success' });
      reset(EMPTY_FORM);
    },
  });
  const {
    control,
    formState: { isSubmitting },
    reset,
  } = methods;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <ZodForm {...methods}>
        <CardContent className="space-y-2">
          <ControlledPasswordField control={control} name="currentPassword" label="Current Password" />
          <ControlledPasswordField control={control} name="password" label="New Password" />
          <ControlledPasswordField control={control} name="passwordConfirmation" label="Confirm New Password" />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            Change Password
          </Button>
        </CardFooter>
      </ZodForm>
    </Card>
  );
}

export { ChangePasswordForm };
