'use client';

import Link from 'next/link';
import { UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogoutDropdownMenuItem } from '../LogoutButton';

export function MyAccountDropdown() {
  const { data, status } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-secondary/50 hover:text-secondary-foreground"
          disabled={status === 'loading'}
        >
          <span className="sr-only">Open</span>
          <UserIcon className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== 'authenticated' && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">Login</Link>
            </DropdownMenuItem>
          </>
        )}
        {status === 'authenticated' && !!data?.user && (
          <>
            <DropdownMenuLabel>{data?.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">My Account</Link>
            </DropdownMenuItem>
            <LogoutDropdownMenuItem />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
