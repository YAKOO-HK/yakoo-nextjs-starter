'use client';

import { useAtomValue } from 'jotai';
import { cn } from '@/lib/utils';
import { leftDrawerAtom } from './LeftDrawer';

export function Main({ className, children }: { className?: string; children: React.ReactNode }) {
  const isOpen = useAtomValue(leftDrawerAtom);
  return (
    <main
      id="main"
      className={cn('transition-margin relative min-h-[25rem] duration-300 ease-in-out', className, {
        'md:ml-64': isOpen,
        'ml-0': !isOpen,
      })}
    >
      {children}
    </main>
  );
}
