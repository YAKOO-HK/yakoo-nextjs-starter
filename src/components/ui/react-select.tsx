import React from 'react';
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react';
import Select, {
  type ClearIndicatorProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type OptionProps,
} from 'react-select';
import { cn } from '@/lib/utils';

export function ReactSelectOption<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({ innerProps, label, isSelected, isDisabled, isFocused }: OptionProps<Option, IsMulti, Group>) {
  return (
    <div
      {...innerProps}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-4 pr-2 text-sm outline-none',
        {
          'pointer-events-none opacity-50': isDisabled,
          'bg-accent text-accent-foreground': isFocused,
        }
      )}
    >
      {isSelected ? <CheckIcon className="h-4 w-4" /> : <span className="inline-block h-4 w-4" aria-hidden="true" />}
      <div className="ml-2">{label}</div>
    </div>
  );
}
function ReactSelectDropdownIndicator<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({ innerProps }: DropdownIndicatorProps<Option, IsMulti, Group>) {
  return (
    <div {...innerProps}>
      <ChevronDownIcon className="h-4 w-4 opacity-50" />
    </div>
  );
}

function ReactSelectClearIndicator<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({ innerProps }: ClearIndicatorProps<Option, IsMulti, Group>) {
  return (
    <div {...innerProps}>
      <XIcon className="h-4 w-4 opacity-50" />
    </div>
  );
}

export interface ReactSelectProps<
  TOption extends { code: string; name: string },
  IsMulti extends boolean,
  Group extends GroupBase<TOption> = GroupBase<TOption>,
> extends Omit<
    React.ComponentPropsWithRef<typeof Select<TOption, IsMulti, Group>>,
    'unstyled' | 'classNames' | 'components'
  > {
  isError?: boolean;
}

export function ReactSelect<
  TOption extends { code: string; name: string },
  IsMulti extends boolean = false,
  Group extends GroupBase<TOption> = GroupBase<TOption>,
>({
  isError,
  noOptionsMessage = () => 'No Options',
  options,
  ref,
  ...props
}: ReactSelectProps<TOption, IsMulti, Group>) {
  // console.log(ref);
  return (
    <Select
      unstyled
      ref={ref}
      classNames={{
        container: ({ isFocused, isDisabled }) =>
          cn('relative w-full rounded-md border border-input bg-transparent text-sm ring-offset-background', {
            'outline-none ring-2 ring-ring ring-offset-2': isFocused,
            'cursor-not-allowed opacity-50': isDisabled,
            'border-red-700': isError,
          }),
        control: () => 'px-3 py-2',
        menu: ({}) =>
          'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 translate-y-1',
        menuList: () => 'p-1',
        valueContainer: () => 'gap-1',
        multiValue: () => 'flex items-center rounded-sm py-1 px-1.5 space-x-1 text-sm bg-accent text-accent-foreground',
        indicatorSeparator: () => 'mx-1',
      }}
      options={options}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.code}
      components={{
        Option: ReactSelectOption,
        DropdownIndicator: ReactSelectDropdownIndicator,
        ClearIndicator: ReactSelectClearIndicator,
      }}
      noOptionsMessage={noOptionsMessage}
      {...props}
    />
  );
}
