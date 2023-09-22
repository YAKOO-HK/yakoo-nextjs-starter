import { AdminUserCreateForm } from './AdminUserCreateForm';

export const metadata = {
  title: 'Create Admin User',
};

export default async function AdminUserCreatePage() {
  return (
    <div className="container max-w-screen-md py-4 @container">
      <AdminUserCreateForm />
    </div>
  );
}
