import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { AdminLoginForm } from './AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default async function AdminLoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const user = await getSessionUser();
  if (user?.type === 'admin') {
    // redirect if user already logged in
    redirect(searchParams.callbackUrl ?? '/admin/dashboard');
  }
  return (
    <div className="container max-w-screen-md py-4">
      <header className="mb-4 text-xl">Yakoo NextJS Starter Template</header>
      <AdminLoginForm />
    </div>
  );
}
