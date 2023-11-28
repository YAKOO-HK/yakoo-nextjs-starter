import { ReactNode } from 'react';
import { FieldPath, FieldValues, type ControllerProps } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker, DatePickerProps } from './DatePicker';

export interface ControlledDatePickerFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<DatePickerProps, 'name' | 'disabled'> {
  label?: ReactNode;
  helperText?: ReactNode;
  description?: ReactNode;
  fieldProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
}

function ControlledDatePickerField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  defaultValue,
  shouldUnregister,
  rules,
  helperText,
  description,
  fieldProps,
  disabled,
  ...props
}: ControlledDatePickerFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      render={({ field }) => (
        <FormItem {...fieldProps}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <DatePicker {...props} onChange={field.onChange} name={field.name} value={field.value} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
}
export { ControlledDatePickerField };
