'use client';

import { signOut } from 'next-auth/react';
import { Button, ButtonProps } from './ui/button';
import { DropdownMenuItem } from './ui/dropdown-menu';

function LogoutButton({ callbackUrl = '/', ...props }: { callbackUrl?: string } & Omit<ButtonProps, 'onClick'>) {
  return <Button onClick={() => signOut({ callbackUrl })} {...props} />;
}

export interface LogoutDropdownMenuItemProps extends Omit<React.ComponentProps<typeof DropdownMenuItem>, 'onSelect'> {
  callbackUrl?: string;
}
function LogoutDropdownMenuItem({ callbackUrl = '/', ...props }: LogoutDropdownMenuItemProps) {
  return (
    <DropdownMenuItem {...props} onSelect={() => signOut({ callbackUrl })}>
      Logout
    </DropdownMenuItem>
  );
}

export { LogoutButton, LogoutDropdownMenuItem };
