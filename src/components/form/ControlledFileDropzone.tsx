import * as React from 'react';
import type { ControllerProps, FieldPath, FieldValues, PathValue } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FileDropzoneField, type FileDropzoneFieldProps } from './FileDropzoneField';

export interface ControlledFileDropzoneProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render'>,
    Omit<FileDropzoneFieldProps, 'defaultValue' | 'name' | 'onChange' | 'value'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

const ControlledFileDropzone = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  control,
  name,
  defaultValue,
  rules,
  shouldUnregister,
  helperText,
  className,
  ...props
}: ControlledFileDropzoneProps<TFieldValues, TName>) => {
  return (
    <FormField
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, ...field }, fieldState: { error } }) => (
        <FormItem className={cn('group', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <FileDropzoneField
              {...props}
              {...field}
              onChange={(files) => onChange(files as PathValue<TFieldValues, TName>)}
              isError={!!error}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage>{helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default ControlledFileDropzone;
