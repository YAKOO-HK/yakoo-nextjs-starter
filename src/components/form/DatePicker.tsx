import * as React from 'react';
import { CalendarIcon, XCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toDate } from '@/lib/formatter';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  name: string;
  value?: Date;
  onChange: (date?: Date | null) => unknown;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
}

export function DatePicker({ name, value, onChange, placeholder, className, allowClear = false }: DatePickerProps) {
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
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
          {allowClear && (
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className="mx-2 my-1"
                size="sm"
                onClick={() => {
                  onChange(null);
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
