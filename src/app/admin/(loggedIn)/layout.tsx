import Image from 'next/image';
import Link from 'next/link';
import { ChevronDownIcon, SettingsIcon, UserIcon, Users2Icon, UsersIcon } from 'lucide-react';
import { Header } from '@/components/layout/admin/Header';
import { LeftDrawer } from '@/components/layout/admin/LeftDrawer';
import { Main } from '@/components/layout/admin/Main';
import { NavMenu, NavMenuButton, NavMenuLinkItem } from '@/components/layout/admin/NavMenu';
import { LogoutDropdownMenuItem } from '@/components/LogoutButton';
import { RequireAdminRole } from '@/components/rbac/admin';
import { SimpleCollapsible } from '@/components/SimpleCollapsible';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { requireAdminUser } from '@/lib/auth';

export default async function AdminLoggedInLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await requireAdminUser();
  return (
    <div className="relative min-h-screen flex-col bg-neutral-50">
      <LeftDrawer>
        <div className="flex justify-center p-2">
          <Image src="/images/logo.png" width={60} height={60} alt="" />
        </div>
        <NavMenu>
          <NavMenuLinkItem href="/admin/frontend-users">
            <UsersIcon className="mr-4 size-6" />
            Frontend Users
          </NavMenuLinkItem>
          <RequireAdminRole role="sysadmin">
            <SimpleCollapsible
              triggerButton={
                <NavMenuButton>
                  <SettingsIcon className="mr-4 size-6" />
                  Administration
                  <ChevronDownIcon className="ml-2 size-4" />
                </NavMenuButton>
              }
            >
              <NavMenu>
                <NavMenuLinkItem href="/admin/admin-users" wrapperClassName="px-8">
                  <Users2Icon className="mr-4 size-6" />
                  Admin Users
                </NavMenuLinkItem>
              </NavMenu>
            </SimpleCollapsible>
          </RequireAdminRole>
        </NavMenu>
      </LeftDrawer>
      <Header>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto rounded-full p-2 hover:bg-secondary/50 hover:text-secondary-foreground"
            >
              <span className="sr-only">Open</span>
              <UserIcon className="size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{adminUser.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/account">My Profile</Link>
            </DropdownMenuItem>
            <LogoutDropdownMenuItem callbackUrl="/admin/login" />
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <Main>{children}</Main>
    </div>
  );
}
