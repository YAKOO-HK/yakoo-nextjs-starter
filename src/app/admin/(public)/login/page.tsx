import { type Metadata } from 'next';
import Image from 'next/image';
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
      <div className="flex justify-center p-2">
        <Image src="/images/logo.png" width={180} height={180} alt="Logo" />
      </div>
      <AdminLoginForm />
    </div>
  );
}
