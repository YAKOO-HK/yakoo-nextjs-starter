import type { ControllerProps, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ControlledDropdownProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<React.ComponentProps<typeof Select>, 'name' | 'defaultValue'> {
  allowEmpty?: boolean;
  disabled?: boolean;
  loading?: boolean;
  init?: boolean;
  data?: { code: string; name: string }[];
  placeholder?: string;
  className?: string;
  contentProps?: React.ComponentProps<typeof SelectContent>;
  triggerProps?: React.ComponentProps<typeof SelectTrigger>;
  labelProps?: React.ComponentProps<typeof FormLabel>;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
}

export const ControlledDropdown = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  allowEmpty = true,
  disabled = false,
  loading = false,
  init,
  data = [],
  placeholder,
  label,
  className,
  contentProps,
  triggerProps,
  labelProps,
  helperText,
  description,
  ...props
}: ControlledDropdownProps<TFieldValues, TName>) => {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { value, onChange, onBlur } }) => (
        <FormItem className={cn('group', className)}>
          {label && <FormLabel {...labelProps}>{label}</FormLabel>}
          <Select
            disabled={loading || disabled}
            {...props}
            onValueChange={(v) => onChange(v as PathValue<TFieldValues, TName>)}
            name={name}
            value={(typeof value === 'number' || typeof value === 'boolean' ? `${value}` : value) || ''}
            onOpenChange={(open) => {
              if (!open) {
                onBlur();
              }
            }}
          >
            <FormControl>
              <SelectTrigger {...triggerProps}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent {...contentProps}>
              {loading && (
                <SelectItem value="" disabled>
                  Loading ...
                </SelectItem>
              )}
              {!loading && allowEmpty ? <SelectItem value="">&nbsp;</SelectItem> : null}
              {data &&
                data.map((row) => (
                  <SelectItem key={row.code} value={row.code}>
                    {row.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};
