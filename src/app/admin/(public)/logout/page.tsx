import { Suspense } from 'react';
import { AutoLogout } from '@/components/rbac/AutoLogout';

export default function LogoutPage() {
  return (
    <div className="container py-4 @container">
      <Suspense>
        <AutoLogout redirectUrl="/admin/login" />
      </Suspense>
    </div>
  );
}
