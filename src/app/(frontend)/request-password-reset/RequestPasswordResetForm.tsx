'use client';

import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Loader2Icon } from 'lucide-react';
import SuperJSON from 'superjson';
import { ControlledHCaptcha } from '@/components/form/ControlledHCaptcha';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { RequestPasswordResetSchema } from '@/types/user';

export function RequestPasswordResetForm() {
  const { toast } = useToast();
  const hCaptchaRef = useRef<HCaptcha>(null);
  const methods = useZodForm({
    zodSchema: RequestPasswordResetSchema,
    defaultValues: { email: '', hCaptcha: '' },
    onSubmit: async (data) => {
      await fetch('/api/request-password-reset', {
        body: SuperJSON.stringify(data),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(fetchResponseHandler());

      hCaptchaRef.current?.resetCaptcha();
      reset({
        email: '',
        hCaptcha: '',
      });
      toast({
        title: 'Success',
        description:
          'An email has been sent to your email address. Please follow the instructions in the email to reset your password.',
      });
    },
    onError: () => {
      hCaptchaRef.current?.resetCaptcha();
    },
  });
  const {
    control,
    formState: { isSubmitting },
    reset,
  } = methods;

  return (
    <ZodForm {...methods}>
      <CardHeader>
        <CardTitle>Request Password Reset</CardTitle>
        <CardDescription>Please fill in the form below to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-4">
          <ControlledTextField control={control} name="email" label="Email" className="bg-background" />
          <ControlledHCaptcha control={control} name="hCaptcha" hCaptchaRef={hCaptchaRef} />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
          Request Reset Password
        </Button>
      </CardFooter>
    </ZodForm>
  );
}
