import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { env } from '@/env';
import { cn } from '@/lib/utils';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  return (
    <div className="container max-w-screen-md py-4">
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
