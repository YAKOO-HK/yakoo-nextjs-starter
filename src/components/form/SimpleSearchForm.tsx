import React from 'react';
import concat from 'lodash-es/concat';
import pick from 'lodash-es/pick';
import uniq from 'lodash-es/uniq';
import { SearchIcon, SquareIcon, XIcon } from 'lucide-react';
import { Control, DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useZodForm } from '@/hooks/useZodForm';
import { cn } from '@/lib/utils';
import { ControlledTextField } from './ControlledTextField';

function FieldGridItem<TFieldValues extends FieldValues, TContext = any>({
  name,
  control,
  field,
}: {
  name: string;
  control: Control<TFieldValues, TContext>;
  field?: { name: string; className?: string; FieldComponent?: React.ComponentType<any>; GridProps?: any };
}) {
  if (!field) {
    return null; // TODO: show error?
  }
  const { FieldComponent = ControlledTextField, GridProps = {}, className, ...props } = field;
  const { className: gridClassName, ...restGridProps } = GridProps;
  return (
    <div className={cn('col-span-12 @3xl:col-span-4', gridClassName)} {...restGridProps}>
      {React.createElement(FieldComponent, { className: cn('w-full', className), ...props, name, control })}
    </div>
  );
}

export type SearchFieldConfig<T extends React.ComponentType<any> = typeof ControlledTextField> = {
  name: string;
  FieldComponent?: T;
  GridProps?: React.ComponentProps<'div'>;
} & React.ComponentProps<T>;

export function SimpleSearchForm<TZodSchema extends z.Schema, TFieldValues extends FieldValues, TContext = any>({
  id,
  zodSchema,
  onSearch,
  defaultValues,
  clearValues,
  availableFields = [],
  staticFilters = [],
  extraFilters = [],
  className,
  children,
  ...props
}: {
  zodSchema: TZodSchema;
  onSearch: (values: Partial<TFieldValues>) => any;
  defaultValues?: DefaultValues<TFieldValues>;
  clearValues: DefaultValues<TFieldValues>;
  availableFields?: SearchFieldConfig<any>[];
  staticFilters?: string[];
  extraFilters?: string[];
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const generatedId = React.useId();
  const formId = id || generatedId;
  const allFilters = uniq(concat(staticFilters, extraFilters));

  const wrapOnSearch = (values: TFieldValues) => onSearch(pick(values, allFilters) as Partial<TFieldValues>);
  const methods = useZodForm<TZodSchema, TFieldValues, TContext>({
    zodSchema,
    onSubmit: wrapOnSearch,
    defaultValues,
  });
  const {
    control,
    reset,
    formState: { submitCount, isSubmitSuccessful, isDirty },
  } = methods;
  const wrapOnClear = async () => {
    // console.log(clearValues);
    reset(clearValues);
    await onSearch(clearValues);
  };

  React.useEffect(() => {
    // console.log(submitCount, isSubmitSuccessful, isDirty, defaultValues);
    if (isSubmitSuccessful && isDirty) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, isSubmitSuccessful, isDirty]);

  return (
    <ZodForm {...methods} className={cn('mb-2 overflow-visible', className)} id={formId} {...props}>
      <Card>
        <CardContent>
          <div className="grid grid-cols-12 gap-2 py-2">
            {allFilters.map((name) => (
              <FieldGridItem
                key={name}
                name={name}
                control={control}
                field={availableFields.find((field) => field.name === name)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-row gap-2">
            <Button type="submit" variant="default" color="primary" form={formId}>
              <SearchIcon className="mr-1 size-4" aria-hidden="true" /> Search
            </Button>
            <Button type="button" variant="outline" onClick={wrapOnClear}>
              <XIcon className="mr-1 size-4" aria-hidden="true" /> Clear
            </Button>
            <Button type="reset" variant="outline" onClick={() => reset(defaultValues)}>
              <SquareIcon className="mr-1 size-4" aria-hidden="true" /> Reset
            </Button>
            {children}
          </div>
        </CardFooter>
      </Card>
    </ZodForm>
  );
}
