'use client';

import { AdminRole } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import type { AdminUserWithRoles } from '@/app/api/admin/admin-users/[id]/route';
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
import { AdminUserPatchSchema, type AdminUserPatchFormData } from '@/types/admin/admin-users';

function InnerAdminUserUpdateForm({
  data,
  onSubmit,
}: {
  data: AdminUserWithRoles;
  onSubmit: (data: AdminUserPatchFormData) => any;
}) {
  const { data: roles } = useQuery({
    queryKey: ['/api/values/admin-roles'],
    queryFn: () => fetch('/api/values/admin-roles').then(fetchResponseHandler<AdminRole[]>()),
    initialData: [],
  });

  const methods = useZodForm({
    zodSchema: AdminUserPatchSchema,
    defaultValues: {
      name: data.name,
      email: data.email,
      status: data.status,
      roleNames: data.roles?.map((role) => role.name) ?? [],
    } as AdminUserPatchFormData,
    onSubmit,
  });

  const {
    control,
    formState: { isSubmitting },
  } = methods;
  return (
    <ZodForm {...methods}>
      <Card>
        <CardHeader>
          <CardTitle>Update Admin User: {data.id}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 space-y-4">
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
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </CardFooter>
      </Card>
    </ZodForm>
  );
}

export function AdminUserUpdateForm({ id }: { id: string }) {
  const { data, isLoading, mutateAsync } = useAsyncMutationData<AdminUserWithRoles, AdminUserPatchFormData>({
    url: `/api/admin/admin-users/${id}`,
  });
  if (!data || isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }
  return <InnerAdminUserUpdateForm data={data} onSubmit={mutateAsync} />;
}
