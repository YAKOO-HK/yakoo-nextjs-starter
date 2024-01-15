import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminUsersList } from './AdminUsersList';

export const metadata = {
  title: 'Admin Users',
};

export default async function AdminUserPage() {
  return (
    <>
      <div className="container my-2 max-w-screen-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl">Admin Users</h1>
          <Link
            href="/admin/admin-users/create"
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'mx-2')}
          >
            <PlusIcon className="mr-2 size-4" />
            Add
          </Link>
        </div>
      </div>
      <AdminUsersList />
    </>
  );
}
