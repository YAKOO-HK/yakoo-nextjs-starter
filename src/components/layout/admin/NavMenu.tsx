'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import Link from 'next/link';
import { useSetAtom } from 'jotai/react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import { leftDrawerAtom } from './LeftDrawer';

export function NavMenuLinkItem({
  wrapperClassName,
  href,
  children,
  prefetch,
}: {
  wrapperClassName?: string;
  href: string;
  children: ReactNode;
  prefetch?: boolean;
}) {
  const setIsOpen = useSetAtom(leftDrawerAtom);
  const isMobile = useMediaQuery('screen and (max-width: 768px)');
  return (
    <li className={cn('px-4 py-2 hover:rounded-lg hover:bg-neutral-600 hover:text-slate-50', wrapperClassName)}>
      <Link
        href={href}
        className="flex flex-row items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        onClick={isMobile ? () => setIsOpen(false) : undefined}
        prefetch={prefetch}
      >
        {children}
      </Link>
    </li>
  );
}
export function NavMenuButton({
  wrapperClassName,
  className,
  ...props
}: ComponentPropsWithRef<'button'> & { wrapperClassName?: string }) {
  return (
    <li className={cn('px-4 py-2 hover:rounded-lg hover:bg-neutral-600 hover:text-slate-50', wrapperClassName)}>
      <button
        type="button"
        className={cn(
          'flex w-full flex-row items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background',
          className
        )}
        {...props}
      />
    </li>
  );
}

export function NavMenu({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <nav>
      <ul className={cn('my-0 ml-0 list-none [&>li]:mt-0', className)}>{children}</ul>
    </nav>
  );
}
