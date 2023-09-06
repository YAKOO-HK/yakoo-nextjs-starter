import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAdminUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChangePasswordForm } from './ChangePasswordForm';

export const metadata = {
  title: 'My Profile',
};

export const revalidate = 0;
export default async function MyProfilePage() {
  const user = await requireAdminUser();
  const admin = await prisma.adminUser.findUniqueOrThrow({
    where: { id: user.id },
  });

  return (
    <div className="container py-4 @container">
      <div className="grid grid-cols-12 gap-2">
        <Card className="col-span-12 @3xl:col-span-8">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">Username</div>
              <div className="grow">{admin.username}</div>
            </div>
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">Name</div>
              <div className="grow">{admin.name}</div>
            </div>
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">Email</div>
              <div className="grow">{admin.email}</div>
            </div>
          </CardContent>
        </Card>
        <ChangePasswordForm className="col-span-12 @3xl:col-span-4" />
      </div>
    </div>
  );
}
