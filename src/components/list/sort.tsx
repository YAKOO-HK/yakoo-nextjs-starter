import * as React from 'react';
import { ArrowDownNarrowWideIcon, ArrowUpNarrowWideIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface SortLabelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  direction?: 'asc' | 'desc';
}
export function SortLabel({ active, direction, children, className, ...props }: SortLabelProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" type="button" className={cn('h-auto px-2 py-1', className)} {...props}>
            <span className="sr-only">Sort by </span>
            {children}
            {active &&
              (direction === 'asc' ? <ChevronUpIcon className="ml-1" /> : <ChevronDownIcon className="ml-1" />)}
          </Button>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            {active
              ? direction === 'asc'
                ? 'Click to Sort descending'
                : 'Click to sort ascending'
              : 'Click to sort ascending'}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

// get the aria-sort value for a column
export function getAriaSort(active: boolean, direction?: 'asc' | 'desc') {
  if (!active) {
    return 'none';
  }
  return direction === 'asc' ? 'ascending' : 'descending';
}

export function SortButton({
  sort,
  columnData = [],
  onSortChange,
  ...props
}: {
  sort?: { key: string; asc: boolean };
  columnData: { id: string; label: React.ReactNode }[];
  onSortChange?: (sort: { key: string; asc: boolean }) => void;
} & ButtonProps) {
  const label = columnData.find((r) => r.id === sort?.key)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...props}>
          {sort?.asc ? (
            <ArrowUpNarrowWideIcon className="mr-2 h-6 w-6" />
          ) : (
            <ArrowDownNarrowWideIcon className="mr-2 h-6 w-6" />
          )}
          {label ? (
            <>
              {label} {sort?.asc ? 'Asc' : 'Desc'}
            </>
          ) : (
            'Sort'
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {columnData.map((column) => (
          <React.Fragment key={column.id}>
            <DropdownMenuItem onClick={() => onSortChange?.({ key: column.id, asc: true })}>
              {column.label} Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange?.({ key: column.id, asc: false })}>
              {column.label} Desc
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
