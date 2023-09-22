import { requireAdminRole } from '@/lib/rbac';

export default async function SysadminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminRole('sysadmin');
  return <>{children}</>;
}
