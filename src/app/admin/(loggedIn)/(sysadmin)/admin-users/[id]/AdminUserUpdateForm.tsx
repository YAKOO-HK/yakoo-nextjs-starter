'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import type { AdminUserWithRoles } from '@/app/api/admin/admin-users/[id]/route';
import BackButton from '@/components/BackButton';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsyncMutationData } from '@/hooks/useAsyncMutationData';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { AdminUserPutSchema, type AdminUserPutFormData } from '@/types/admin/admin-users';

function UpdateForm({ data, onSubmit }: { data: AdminUserWithRoles; onSubmit: (data: AdminUserPutFormData) => any }) {
  const { data: roles } = useQuery({
    queryKey: ['/api/admin/values/admin-roles'],
    queryFn: () =>
      fetch('/api/admin/values/admin-roles').then(fetchResponseHandler<{ name: string; description: string }[]>()),
    initialData: [],
  });

  const methods = useZodForm({
    zodSchema: AdminUserPutSchema,
    defaultValues: {
      username: data.username,
      name: data.name,
      email: data.email,
      status: data.status,
      roleNames: data.authAssignments?.map(({ authItem }) => authItem.name) ?? [],
    } satisfies AdminUserPutFormData,
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
        <FormField
          name="roleNames"
          control={control}
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Roles</FormLabel>
              </div>
              {roles.map((role) => (
                <FormField
                  key={role.name}
                  control={control}
                  name="roleNames"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(role.name)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value ?? []), role.name])
                                : field.onChange(field.value?.filter((value: string) => value !== role.name));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{role.description}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
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

export function AdminUserUpdateForm({ id }: { id: string }) {
  const { data, isLoading, mutateAsync } = useAsyncMutationData<AdminUserWithRoles, AdminUserPutFormData>({
    url: `/api/admin/admin-users/${id}`,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Admin User: {id}</CardTitle>
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
