import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { verifyPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { AdminResetPasswordForm } from './AdminResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: null,
};

const getAdminUser = async (token: string) => {
  if (!verifyPasswordResetToken(token)) {
    return null;
  }
  return await prisma.adminUser.findFirst({
    where: {
      passwordResetToken: token,
      status: 10,
    },
  });
};

export default async function AdminResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token;
  if (!token) {
    notFound();
  }
  const adminUser = await getAdminUser(token);
  if (!adminUser) {
    return (
      <div className="container my-4 max-w-screen-md rounded-lg border border-red-700 bg-red-200 px-4 py-2 text-red-700">
        <h1 className="mb-2 text-2xl font-bold">Invalid Token</h1>
        <p>The token is invalid or has expired.</p>
      </div>
    );
  }
  return (
    <div className="container max-w-screen-md py-4">
      <AdminResetPasswordForm name={adminUser.name} token={token} />
    </div>
  );
}
