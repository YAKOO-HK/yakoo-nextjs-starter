'use client';

import { useAdminRoleAndPermissions } from '@/hooks/admin/useAdminRoleAndPermissions';

function RequireAdminRole({
  role,
  children,
  fallback = null,
}: {
  role: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { roles } = useAdminRoleAndPermissions();
  if (!roles.has(role)) {
    return fallback;
  }
  return <>{children}</>;
}

function RequireAdminPermission({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { permissions } = useAdminRoleAndPermissions();
  if (!permissions.has(permission)) {
    return fallback;
  }
  return <>{children}</>;
}

export { RequireAdminRole, RequireAdminPermission };
