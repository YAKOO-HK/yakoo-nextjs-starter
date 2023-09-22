import { AutoLogout } from '@/components/rbac/AutoLogout';

export default function LogoutPage() {
  return (
    <div className="container py-4 @container">
      <AutoLogout redirectUrl="/admin/login" />
    </div>
  );
}
