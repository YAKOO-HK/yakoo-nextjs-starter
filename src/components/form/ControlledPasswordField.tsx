import { ReactNode } from 'react';
import { FieldPath, FieldValues, type ControllerProps } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput, PasswordInputProps } from '@/components/ui/password-input';

export interface ControlledPasswordFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<PasswordInputProps, 'name' | 'defaultValue'> {
  label?: ReactNode;
  helperText?: ReactNode;
  description?: ReactNode;
  fieldProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
}

function ControlledPasswordField<
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
  ...props
}: ControlledPasswordFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <FormItem {...fieldProps}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <PasswordInput autoComplete="off" {...props} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
}

export { ControlledPasswordField };
