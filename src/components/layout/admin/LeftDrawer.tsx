'use client';

import { atom, useAtomValue, useSetAtom } from 'jotai';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export const leftDrawerAtom = atom<boolean>(true);

export function LeftDrawer({ className, children }: { className?: string; children: React.ReactNode }) {
  const isOpen = useAtomValue(leftDrawerAtom);
  const setIsOpen = useSetAtom(leftDrawerAtom);
  return (
    <>
      <div
        id="left-drawer"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-white shadow-md transition-transform duration-300 ease-in-out',
          {
            '-translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
          },
          className
        )}
        aria-expanded={isOpen}
      >
        <ScrollArea className="h-full w-full">{children}</ScrollArea>
      </div>
      <div
        className={cn('fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden', {
          hidden: !isOpen,
        })}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        // onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
      />
    </>
  );
}

export function LeftDrawerToggleButton() {
  const setIsOpen = useSetAtom(leftDrawerAtom);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-controls="left-drawer"
      onClick={() => setIsOpen((isOpen) => !isOpen)}
      className="rounded-full hover:bg-primary/50 hover:text-primary-foreground"
    >
      <span className="sr-only">Toggle Left Drawer</span>
      <MenuIcon className="h-6 w-6" />
    </Button>
  );
}
