import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { requireFrontendUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { ChangePasswordForm } from './ChangePasswordForm';

export const metadata = {
  title: 'My Account',
};

export const revalidate = 0;
export const dynamic = 'force-dynamic';
export default async function MyAccountPage() {
  const frontendUser = await requireFrontendUser();
  return (
    <div className="container py-4 @container">
      <div className="grid grid-cols-12 gap-2">
        <Card className="col-span-12 @3xl:col-span-8">
          <CardHeader>
            <CardTitle>My Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">Username</div>
              <div className="grow">{frontendUser.username}</div>
            </div>
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">Name</div>
              <div className="grow">{frontendUser.name}</div>
            </div>
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">Email</div>
              <div className="grow">{frontendUser.email}</div>
            </div>
            <div className="flex flex-col justify-center gap-2 leading-normal md:flex-row md:items-center">
              <div className="w-48 font-semibold">2FA Enabled?</div>
              <div className="grow">{frontendUser.enableMfa ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
          <CardFooter>
            {!frontendUser.enableMfa ? (
              <Link href="/account/mfa" className={cn(buttonVariants({}))}>
                Enable 2-Factor Authentication
              </Link>
            ) : null}
          </CardFooter>
        </Card>
        <ChangePasswordForm className="col-span-12 @3xl:col-span-4" />
      </div>
    </div>
  );
}
