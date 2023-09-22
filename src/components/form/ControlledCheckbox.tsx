import * as React from 'react';
import type { ControllerProps, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export interface ControlledCheckboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<React.ComponentProps<typeof Checkbox>, 'name' | 'defaultValue'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

const ControlledCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  id,
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  label,
  helperText,
  description,
  containerClassName,
  ...props
}: ControlledCheckboxProps<TFieldValues, TName>) => {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, value } }) => (
        <FormItem className={cn('group', containerClassName)}>
          <div className="flex items-center">
            <FormControl>
              <Checkbox
                color="primary"
                value="true"
                checked={Boolean(value)}
                onCheckedChange={(checked) => onChange(checked as PathValue<TFieldValues, TName>)}
                {...props}
              />
            </FormControl>
            {label && <FormLabel className="ml-2">{label}</FormLabel>}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};
export { ControlledCheckbox };
export default ControlledCheckbox;
