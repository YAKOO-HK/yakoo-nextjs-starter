'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import SuperJSON from 'superjson';
import BackButton from '@/components/BackButton';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { ControlledTextField } from '@/components/form/ControlledTextField';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { AdminUserCreateFormData, AdminUserCreateSchema } from '@/types/admin/admin-users';

const AdminUserCreateForm = () => {
  const { data: roles } = useQuery({
    queryKey: ['/api/admin/values/admin-roles'],
    queryFn: () =>
      fetch('/api/admin/values/admin-roles').then(fetchResponseHandler<{ name: string; description: string }[]>()),
    initialData: [],
  });
  const router = useRouter();
  const methods = useZodForm({
    zodSchema: AdminUserCreateSchema,
    defaultValues: {
      username: '',
      name: '',
      email: '',
      roleNames: [],
      status: 10,
    } as AdminUserCreateFormData,
    onSubmit: async (data) => {
      const user = await fetch('/api/admin/admin-users', {
        body: SuperJSON.stringify(data),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(fetchResponseHandler<{ id: string }>());
      router.replace(`/admin/admin-users/${user.id}`);
    },
  });
  const {
    control,
    formState: { isSubmitting },
  } = methods;
  return (
    <ZodForm {...methods}>
      <Card>
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
        </CardHeader>
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
                                  : field.onChange(field.value?.filter((value) => value !== role.name));
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
      </Card>
    </ZodForm>
  );
};

export { AdminUserCreateForm };
