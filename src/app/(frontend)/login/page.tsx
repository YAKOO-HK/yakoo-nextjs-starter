import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CircleXIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/button';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="container max-w-screen-md py-4">
      {searchParams.error === 'CredentialsSignin' ? (
        <Alert variant="destructive" className="mb-4 pr-8">
          <AlertTitle>Failed to sign in.</AlertTitle>
          <AlertDescription>Please check your credentials.</AlertDescription>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'absolute right-0 top-2')}
            title="Close"
            rel="nofollow"
          >
            <CircleXIcon className="size-4" aria-hidden />
          </Link>
        </Alert>
      ) : null}
      <Suspense>
        <LoginForm />
      </Suspense>
      <p className="my-2 px-4 text-sm">
        {'If you forgot your password, you can '}
        <Link className="text-sky-800 hover:underline" href="/request-password-reset">
          reset it here
        </Link>
        .
      </p>
      {env.SAML_ENABLED ? (
        <div>
          <Link
            href="/api/auth/saml2/sso-redirect"
            prefetch={false}
            className={cn(buttonVariants({ size: 'lg' }), 'w-48')}
          >
            Login with SAML
          </Link>
        </div>
      ) : null}
    </div>
  );
}
