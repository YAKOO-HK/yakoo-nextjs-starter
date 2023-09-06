import type { ControllerProps, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ReactSelect } from '@/components/ui/react-select';
import { cn } from '@/lib/utils';

export interface ControlledReactSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<React.ComponentProps<typeof ReactSelect>, 'name' | 'defaultValue' | 'options'> {
  helperText?: React.ReactNode;
  description?: React.ReactNode;
  label?: React.ReactNode;
  labelProps?: React.ComponentProps<typeof FormLabel>;
  data?: { code: string; name: string }[];
}

export const ControlledReactSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  id,
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  helperText,
  className,
  label,
  labelProps,
  data,
  description,
  isMulti,
  ...props
}: ControlledReactSelectProps<TFieldValues, TName>) => {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { value, onChange, onBlur }, fieldState: { invalid } }) => (
        <FormItem className={cn('group', className)}>
          {label && <FormLabel {...labelProps}>{label}</FormLabel>}
          <FormControl>
            <ReactSelect
              {...props}
              isMulti={isMulti}
              value={
                Array.isArray(value)
                  ? value.map((code: string) => data?.find((r) => r.code === code))
                  : data?.find((r) => r.code === value)
              }
              onChange={(selected) => {
                if (Array.isArray(selected)) {
                  onChange((selected as MultiValue<{ code: string; name: string }>).map((r) => r.code));
                } else {
                  onChange((selected as SingleValue<{ code: string; name: string }>)?.code ?? null);
                }
              }}
              onBlur={onBlur}
              name={name}
              isError={invalid}
              options={data}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};
