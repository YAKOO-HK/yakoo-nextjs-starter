'use client';

import { ReactNode } from 'react';
import { AdminRole } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { fetchResponseHandler } from '@/lib/fetch-utils';

export function RequireAdminRole({ roleName, children }: { roleName: string; children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ['/api/admin/account/roles'],
    queryFn: () => fetch('/api/admin/account/roles').then(fetchResponseHandler<{ items: AdminRole[] }>()),
    staleTime: 1000 * 60 * 5,
  });
  if (!data?.items?.some((role) => role.name === roleName)) {
    return null;
  }
  return children;
}
