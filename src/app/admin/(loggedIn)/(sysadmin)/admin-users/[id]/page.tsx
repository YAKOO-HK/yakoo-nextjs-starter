import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminUserUpdateForm } from './AdminUserUpdateForm';

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  return {
    title: `Admin User: ${params.id}`,
  } as Metadata;
};

export default async function AdminUserPage({ params: { id } }: { params: { id: string } }) {
  const adminUser = await prisma.adminUser.findUnique({
    where: { id },
  });
  if (!adminUser) {
    return notFound();
  }
  return (
    <div className="container max-w-screen-md py-4 @container">
      <AdminUserUpdateForm id={id} />
    </div>
  );
}
