'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Header({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <header
      className={cn(
        'flex h-header flex-row items-center border-b border-b-border bg-background px-2 py-4 shadow-sm',
        className
      )}
    >
      <Link
        href="/"
        className="inline-block rounded-md text-2xl font-medium tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Yakoo NextJS Starter
      </Link>
      <div className="grow" />
      <div>{children}</div>
    </header>
  );
}
