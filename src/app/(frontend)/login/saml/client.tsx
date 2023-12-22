'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { fetchResponseHandler } from '@/lib/fetch-utils';

export function SignInSamlifyForm() {
  const { data } = useQuery({
    queryKey: ['x-saml-token'],
    queryFn: () => fetch('/api/auth/saml2/acs').then(fetchResponseHandler<{ token: string }>()),
  });
  useEffect(() => {
    if (data) {
      // console.log('token', data);
      signIn('samlify', { token: data.token, callbackUrl: '/account', redirect: true });
    }
  }, [data]);
  return null;
}
