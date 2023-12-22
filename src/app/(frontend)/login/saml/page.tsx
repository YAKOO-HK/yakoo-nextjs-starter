import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { env } from '@/env';
import { SignInSamlifyForm } from './client';

export const metadata: Metadata = {
  title: 'Loading...',
  robots: 'noindex, nofollow',
};

export default function SamlSignInPage() {
  if (!env.SAML_ENABLED) {
    notFound();
  }
  return (
    <div>
      <p>Loading ...</p>
      <SignInSamlifyForm />
    </div>
  );
}
