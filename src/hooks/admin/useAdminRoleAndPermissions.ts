import { useQuery } from '@tanstack/react-query';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { ReadonlyRoleAndPermissions } from '@/types/rbac';

function useAdminRoleAndPermissions() {
  const { data } = useQuery({
    queryKey: ['/api/admin/account/rbac'],
    queryFn: async () => fetch('/api/admin/account/rbac').then(fetchResponseHandler<ReadonlyRoleAndPermissions>()),
    initialData: { roles: new Set<string>(), permissions: new Set<string>() },
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
  // console.log('useAdminRolesAndPermissions', data);
  return data;
}

export { useAdminRoleAndPermissions };
