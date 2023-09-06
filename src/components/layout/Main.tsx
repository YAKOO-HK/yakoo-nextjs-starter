'use client';

import { cn } from '@/lib/utils';

export function Main({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main className={cn('relative min-h-[25rem] focus:outline-none', className)} id="main" tabIndex={-1}>
      {children}
    </main>
  );
}
