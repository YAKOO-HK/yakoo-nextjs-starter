import * as React from 'react';
import { CalendarIcon, XCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toDate } from '@/lib/formatter';
import { cn } from '@/lib/utils';

export type DatePickerProps = {
  name: string;
  value?: Date;
  onChange?: (date?: Date | null) => unknown;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
} & Omit<CalendarProps, 'onSelect' | 'selected' | 'mode'>;

export function DatePicker({
  name,
  value,
  onChange,
  placeholder,
  className,
  allowClear = false,
  ...props
}: DatePickerProps) {
  return (
    <>
      <input type="hidden" value={value?.toISOString()} name={name} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground', className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? toDate(value) : <span>{placeholder ?? ''}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-background p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} defaultMonth={value || undefined} {...props} />
          {allowClear && (
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className="mx-2 my-1"
                size="sm"
                onClick={() => {
                  onChange?.(null);
                }}
              >
                <XCircleIcon className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </PopoverClose>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
