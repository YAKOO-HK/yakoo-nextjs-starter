import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { verifyPasswordResetToken } from '@/lib/password';
import { prisma } from '@/lib/prisma';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: null,
  robots: 'noindex',
};
const getUser = async (token: string) => {
  if (!verifyPasswordResetToken(token)) {
    return null;
  }
  return await prisma.frontendUser.findFirst({
    where: {
      passwordResetToken: token,
      status: 10,
    },
  });
};

export const revalidate = 0;
export default async function ResetPasswordPage({
  searchParams: { token } = {},
}: {
  searchParams?: { token?: string };
}) {
  if (!token) {
    notFound();
  }
  const user = await getUser(token);
  if (!user) {
    return (
      <div className="container max-w-screen-md py-4">
        <div className="mb-4 rounded-lg border border-red-700 bg-red-200 px-4 py-2 text-red-700">
          <p className="mb-2 text-2xl font-semibold">Invalid Token</p>
          <p>The token is invalid or has expired.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container max-w-screen-md py-4">
      <Card>
        <ResetPasswordForm name={user.name} token={token} />
      </Card>
    </div>
  );
}
