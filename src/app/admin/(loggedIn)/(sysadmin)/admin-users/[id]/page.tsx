import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminUserUpdateForm } from './AdminUserUpdateForm';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return {
    title: `Admin User: ${id}`,
  } as Metadata;
};

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
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
