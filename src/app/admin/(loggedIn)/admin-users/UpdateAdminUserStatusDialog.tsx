'use client';

import { useState } from 'react';
import SuperJSON from 'superjson';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { ZodForm } from '@/components/form/ZodForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useZodForm } from '@/hooks/useZodForm';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { cn } from '@/lib/utils';
import { AdminUserPatchFormData, AdminUserPatchSchema } from '@/types/admin/admin-users';

function UpdateAdminUserStatusForm({
  id,
  defaultValues,
  onClose,
  refetch,
}: {
  id: string;
  defaultValues: AdminUserPatchFormData;
  onClose: () => unknown;
  refetch: () => unknown;
}) {
  const methods = useZodForm({
    zodSchema: AdminUserPatchSchema,
    defaultValues,
    onSubmit: async (values) => {
      await fetch(`/api/admin/admin-users/${id}`, {
        method: 'PATCH',
        body: SuperJSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
      }).then(fetchResponseHandler());
      refetch();
      onClose();
    },
  });
  const {
    control,
    formState: { isSubmitting },
  } = methods;
  return (
    <ZodForm {...methods}>
      <div className="mb-4 grid grid-cols-1 space-y-4">
        <ControlledDropdown
          allowEmpty={false}
          required
          name="status"
          label="Status"
          control={control}
          data={[
            { code: '0', name: 'Disabled' },
            { code: '10', name: 'Active' },
          ]}
        />
      </div>
      <DialogFooter>
        <Button variant="ghost" role="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Update
        </Button>
      </DialogFooter>
    </ZodForm>
  );
}

export function UpdateAdminUserStatusDialog({
  id,
  status,
  refetch,
}: {
  id: string;
  status: number;
  refetch: () => unknown;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger title={status === 10 ? 'Active' : 'Disabled'} className="inline-flex items-center">
        <div className={cn('mr-2 h-4 w-4 rounded-full', status === 10 ? 'bg-green-500' : 'bg-red-500')} />
        <span>{status === 10 ? 'Active' : 'Disabled'}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <UpdateAdminUserStatusForm
          id={id}
          defaultValues={{ status }}
          onClose={() => setIsOpen(false)}
          refetch={refetch}
        />
      </DialogContent>
    </Dialog>
  );
}
