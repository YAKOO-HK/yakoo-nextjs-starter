'use client';

import { parse, startOfDay } from 'date-fns';
import { Loader2Icon } from 'lucide-react';
import type { AdminFrontendUserGetResponse } from '@/app/api/admin/frontend-users/[id]/route';
import BackButton from '@/components/BackButton';
import { ControlledDatePickerField } from '@/components/form/ControlledDatePickerField';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsyncMutationData } from '@/hooks/useAsyncMutationData';
import { useZodForm } from '@/hooks/useZodForm';
import { AdminFrontendUserPutSchema, type AdminFrontendUserPutFormData } from '@/types/admin/frontend-users';

function UpdateForm({
  data,
  onSubmit,
}: {
  data: AdminFrontendUserGetResponse;
  onSubmit: (data: AdminFrontendUserPutFormData) => any;
}) {
  const methods = useZodForm({
    zodSchema: AdminFrontendUserPutSchema,
    defaultValues: {
      username: data.username,
      name: data.name,
      email: data.email,
      dob: data.dob,
      status: data.status,
    } satisfies AdminFrontendUserPutFormData,
    onSubmit,
  });

  const {
    control,
    formState: { isSubmitting },
  } = methods;
  return (
    <ZodForm {...methods}>
      <CardContent className="grid grid-cols-1 space-y-4">
        <ControlledTextField control={control} name="username" label="Username" required />
        <ControlledTextField control={control} name="name" label="Name" required />
        <ControlledTextField control={control} name="email" label="Email" required />
        <ControlledDatePickerField
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          control={control}
          name="dob"
          label="Date of Birth"
          allowClear
        />
        <ControlledDropdown
          control={control}
          allowEmpty={false}
          name="status"
          label="Status"
          data={[
            { code: '0', name: 'Disabled' },
            { code: '10', name: 'Active' },
          ]}
          required
        />
      </CardContent>
      <CardFooter className="md:space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2Icon className="mr-2 size-4 animate-spin" />}
          Save
        </Button>
        <BackButton>Cancel</BackButton>
      </CardFooter>
    </ZodForm>
  );
}

export function FrontendUserUpdateForm({ id }: { id: string }) {
  const { data, isLoading, mutateAsync } = useAsyncMutationData<
    AdminFrontendUserGetResponse,
    AdminFrontendUserPutFormData
  >({
    url: `/api/admin/frontend-users/${id}`,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Frontend User: {id}</CardTitle>
      </CardHeader>
      {!data || isLoading ? (
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      ) : (
        <UpdateForm data={data} onSubmit={mutateAsync} />
      )}
    </Card>
  );
}
