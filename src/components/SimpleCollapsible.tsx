'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function SimpleCollapsible({
  triggerButton,
  children,
}: {
  triggerButton: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>{triggerButton}</CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
