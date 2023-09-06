import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  return (
    <div className="container max-w-screen-md py-4">
      <LoginForm />
      <p className="my-2 px-4 text-sm">
        {'If you forgot your password, you can '}
        <Link className="text-sky-800 hover:underline" href="/request-password-reset">
          reset it here
        </Link>
        .
      </p>
    </div>
  );
}
