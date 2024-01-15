'use client';

import range from 'lodash-es/range';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface PageSelectProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Select>, 'value' | 'onValueChange'> {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}
export function PageSelect({ count, page, rowsPerPage, onPageChange, ...props }: PageSelectProps) {
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const lowestPage = Math.max(page - 50, 0);
  const highestPage = Math.min(page + 50, lastPage);
  return (
    <Select {...props} value={`${page}`} onValueChange={(value: string) => onPageChange(Number(value))}>
      <SelectTrigger className="h-9 px-2 py-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-96 min-w-[6rem] overflow-y-auto">
        {range(lowestPage, highestPage + 1).map((option) => (
          <SelectItem key={option} value={`${option}`}>
            {option + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export interface PaginationProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}
export function Pagination({ count, page, rowsPerPage, onPageChange }: PaginationProps) {
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  return (
    <nav className="inline-flex items-center -space-x-1" aria-label="Pagination">
      <Button onClick={() => onPageChange(0)} disabled={page === 0} variant="ghost" size="sm">
        <ChevronsLeftIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">First</span>
      </Button>
      <Button onClick={() => onPageChange(Math.max(0, page - 1))} disabled={page === 0} variant="ghost" size="sm">
        <ChevronLeftIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </Button>
      <div className="min-w-[4rem] py-1">
        <PageSelect
          disabled={lastPage <= 1}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
        />
      </div>
      <Button
        onClick={() => onPageChange(Math.min(lastPage, page + 1))}
        disabled={page >= lastPage}
        variant="ghost"
        size="sm"
      >
        <ChevronRightIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </Button>
      <Button onClick={() => onPageChange(lastPage)} disabled={page >= lastPage} variant="ghost" size="sm">
        <ChevronsRightIcon className="size-5" aria-hidden="true" />
        <span className="sr-only">Last</span>
      </Button>
    </nav>
  );
}

export interface PaginationTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number;
  page?: number;
  pageSize: number;
}

export function PaginationText({ count = 0, page = 0, pageSize = 0, className, ...rest }: PaginationTextProps) {
  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, count);
  return (
    <span className={cn('inline-block text-sm', className)} {...rest}>
      {from}-{to} of {count} items
    </span>
  );
}
