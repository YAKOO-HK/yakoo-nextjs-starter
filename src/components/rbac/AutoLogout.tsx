'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';

function AutoLogout({ redirectUrl }: { redirectUrl: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '';
  useEffect(() => {
    signOut({ redirect: false }).then(() => router.replace(`${redirectUrl}?callbackUrl=${callbackUrl}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <p className="prose prose-neutral">Logging out...</p>;
}

export { AutoLogout };
