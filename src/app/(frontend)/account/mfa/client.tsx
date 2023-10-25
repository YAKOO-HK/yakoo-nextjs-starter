'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { CheckIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import SuperJSON from 'superjson';
import { Totp, type TotpConfig } from 'time2fa';
import { z, type ZodIssue } from 'zod';
import ConfirmButton from '@/components/ConfirmButton';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';

const totpAtom = atom<{ url: string; secret: string; config: TotpConfig } | null>(null);
function useGenerateSecret() {
  const setTotp = useSetAtom(totpAtom);
  return useMutation({
    mutationKey: ['/api/account/totp'],
    mutationFn: async () => {
      const data = await fetch('/api/account/totp', { method: 'GET' }).then(
        fetchResponseHandler<{ url: string; secret: string; config: TotpConfig }>()
      );
      return data;
    },
    onSuccess: setTotp,
  });
}

function GenerateSecret() {
  const data = useAtomValue(totpAtom);
  const { mutateAsync, isPending } = useGenerateSecret();
  return data ? (
    <span className="mx-4 my-2 inline-flex">
      <CheckIcon className="mr-2 h-6 w-6 text-green-500" aria-label="Completed" />
      Done
    </span>
  ) : (
    <Button onClick={() => mutateAsync()} disabled={isPending} className="mx-4 my-2">
      Generate new secret
    </Button>
  );
}

function DisplayQrCode() {
  const data = useAtomValue(totpAtom);
  return data?.url ? <QRCodeSVG value={data.url} size={384} includeMargin /> : null;
}

function VerifySetup() {
  const { secret = '', config } = useAtomValue(totpAtom) ?? {};
  const { mutateAsync, data: isValidPasscode } = useMutation({
    mutationFn: async ({ passcode }: { passcode: string }) => {
      if (!Totp.validate({ secret, passcode }, config ?? {})) {
        return Promise.reject({
          status: 422,
          statusText: 'Invalid',
          data: [{ path: ['passcode'], code: 'custom', message: 'Invalid' }] satisfies ZodIssue[],
        });
      }
      return true;
    },
  });
  const methods = useZodForm({
    zodSchema: z.object({ passcode: z.string().trim() }),
    defaultValues: { passcode: '' },
    onSubmit: mutateAsync,
  });
  if (!secret) return null;
  return (
    <ZodForm {...methods} className="flex flex-row items-center gap-2 p-4">
      <ControlledTextField name="passcode" type="text" description={isValidPasscode ? 'All Okay!' : null} />
      <Button type="submit">Verify</Button>
    </ZodForm>
  );
}

function ConfirmEnable2FA() {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const { secret = '', config } = useAtomValue(totpAtom) ?? {};
  if (!secret) return null;
  return (
    <ConfirmButton
      onConfirm={async () => {
        await fetch('/api/account/totp', { method: 'POST', body: SuperJSON.stringify({ secret, config }) }).then(
          fetchResponseHandler()
        );
        startTransition(() => {
          router.refresh();
          router.replace('/account');
        });
      }}
      titleText="Enable 2FA"
      message="Confirm to enable 2FA for your account?"
      confirmText="Yes, enable 2FA"
      className="mx-4 my-2"
    >
      Enable 2FA
    </ConfirmButton>
  );
}

export { GenerateSecret, DisplayQrCode, VerifySetup, ConfirmEnable2FA };
