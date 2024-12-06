import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { FrontendUserUpdateForm } from './FrontendUserUpdateForm';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return {
    title: `Frontend User: ${id}`,
  } as Metadata;
};

export default async function FrontendUserPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const frontendUser = await prisma.frontendUser.findUnique({
    where: { id },
  });
  if (!frontendUser) {
    return notFound();
  }
  return (
    <div className="container max-w-screen-md py-4 @container">
      <FrontendUserUpdateForm id={id} />
    </div>
  );
}
