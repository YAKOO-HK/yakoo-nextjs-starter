'use client';

import { useAtomValue } from 'jotai';
import { cn } from '@/lib/utils';
import { leftDrawerAtom, LeftDrawerToggleButton } from './LeftDrawer';

export function Header({ className, children }: { className?: string; children?: React.ReactNode }) {
  const isOpen = useAtomValue(leftDrawerAtom);
  return (
    <header
      className={cn(
        'transition-margin flex h-header flex-row items-center gap-2 border-b border-b-border bg-background px-2 py-4 shadow-sm duration-300 ease-in-out',
        className,
        {
          'md:ml-64': isOpen,
          'ml-0': !isOpen,
        }
      )}
    >
      <LeftDrawerToggleButton />
      <span className="inline-block flex-1 text-2xl font-medium tracking-tight transition-colors">
        Yakoo NextJS Starter (Admin)
      </span>
      {children}
    </header>
  );
}
