'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { atom } from 'jotai';
import { EditIcon, SendIcon, TrashIcon } from 'lucide-react';
import type { AdminUserRow } from '@/app/api/admin/admin-users/route';
import ConfirmButton from '@/components/ConfirmButton';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { SimpleSearchForm } from '@/components/form/SimpleSearchForm';
import { EnhancedTable, TableCell, TableRow } from '@/components/list/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import useListData from '@/hooks/useListData';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { AdminUserSearchSchema, type AdminUserSearchParams } from '@/types/admin/admin-users';
import { SearchState } from '@/types/search';
import { UpdateAdminUserStatusDialog } from './UpdateAdminUserStatusDialog';

const CLEAR_VALUES: AdminUserSearchParams = {
  username: '',
  name: '',
  email: '',
  status: '',
};

const AVAILABLE_FIELDS = [
  { name: 'username', label: 'Username' },
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email' },
  {
    name: 'status',
    label: 'Status',
    FieldComponent: ControlledDropdown,
    data: [
      { code: '0', name: 'Disabled' },
      { code: '10', name: 'Active' },
    ],
  },
];
const STATIC_FILTERS = ['username', 'name', 'email', 'status'];

function UserSearchForm({
  form,
  onSearch,
}: {
  form: AdminUserSearchParams;
  onSearch: (params: AdminUserSearchParams) => any;
}) {
  return (
    <SimpleSearchForm
      zodSchema={AdminUserSearchSchema}
      defaultValues={{ ...CLEAR_VALUES, ...form }}
      onSearch={onSearch}
      clearValues={CLEAR_VALUES}
      availableFields={AVAILABLE_FIELDS}
      staticFilters={STATIC_FILTERS}
    />
  );
}

const UserRow = ({ rowData, refetch }: { rowData: AdminUserRow; refetch: () => void }) => {
  const { toast } = useToast();
  return (
    <TableRow>
      <TableCell>{rowData.username}</TableCell>
      <TableCell>{rowData.name}</TableCell>
      <TableCell>{rowData.email}</TableCell>
      <TableCell>
        <UpdateAdminUserStatusDialog id={rowData.id} status={rowData.status} refetch={refetch} />
      </TableCell>
      <TableCell>
        <div className="inline-flex flex-row flex-wrap items-center gap-1">
          {rowData.authAssignments.map(({ authItem }) => (
            <span
              key={authItem.name}
              className="rounded-lg bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
            >
              {authItem.name}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>{rowData.createdAt && format(rowData.createdAt, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
      <TableCell>
        <div className="flex flex-row items-center space-x-2">
          <Button asChild title="Edit" className="size-8 p-0">
            <Link href={`/admin/admin-users/${rowData.id}`} prefetch={false}>
              <span className="sr-only">Edit</span>
              <EditIcon className="size-4" />
            </Link>
          </Button>
          <ConfirmButton
            title="Reset Password"
            titleText="Reset Password"
            message="Are you sure you want to reset this user's password?"
            className="size-8 bg-yellow-700 p-0 text-white hover:bg-yellow-700/85"
            onConfirm={async () => {
              try {
                await fetch(`/api/admin/admin-users/${rowData.id}/request-password-reset`, { method: 'POST' }).then(
                  fetchResponseHandler()
                );
                toast({ description: 'Password reset email sent', title: 'Success' });
              } catch (e: any) {
                toast({ description: e.message, title: 'Error', variant: 'destructive' });
              }
            }}
          >
            <SendIcon className="size-4" />
            <span className="sr-only">Reset Password</span>
          </ConfirmButton>
          <ConfirmButton
            onConfirm={async () => {
              try {
                await fetch(`/api/admin/admin-users/${rowData.id}`, {
                  method: 'DELETE',
                }).then(fetchResponseHandler());
                toast({ title: `Admin User [${rowData.username}] deleted.` });
                refetch();
              } catch (e) {
                toast({ title: `Error deleting Admin User ${rowData.username}.` });
              }
            }}
            variant="destructive"
            className="size-8 p-0"
            titleText="Delete Admin User"
            message="Are you sure you want to delete this Admin User?"
            confirmText="Delete"
          >
            <span className="sr-only">Delete</span>
            <TrashIcon className="size-4" />
          </ConfirmButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

const COLUMNS = [
  { id: 'username', label: 'Username', sortable: true },
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { id: 'roles', label: 'Roles', sortable: false },
  { id: 'createdAt', label: 'Created At', sortable: true },
  { id: 'actions', label: '', sortable: false },
];

const searchStateAtom = atom<SearchState>({
  page: 0,
  pageSize: 20,
  sort: { key: 'id', asc: false },
  form: {},
  totalElements: 0,
  totalPages: 0,
  numberOfElements: 0,
});

const PAGESIZE_OPTIONS = [20, 50, 100];

export function AdminUsersList() {
  const { data, isFetching, pageChange, pageSizeChange, sortChange, searchChange, refetch } = useListData<AdminUserRow>(
    {
      atom: searchStateAtom,
      baseUrl: '/api/admin/admin-users',
    }
  );
  return (
    <>
      <div className="container max-w-screen-2xl @container">
        <UserSearchForm form={data.form} onSearch={searchChange} />
        <Card className="py-4">
          <div className="w-full overflow-x-auto">
            <EnhancedTable
              noCheckbox
              className="border-none [&>thead>tr>th]:border-t-0"
              isLoading={isFetching}
              columnData={COLUMNS}
              data={data.items}
              totalElements={data.totalElements}
              pageSize={data.pageSize}
              page={data.page}
              sort={data.sort}
              pageSizeOptions={PAGESIZE_OPTIONS}
              renderRow={({ rowData, ...props }) => (
                <UserRow key={rowData.id} rowData={rowData} {...props} refetch={refetch} />
              )}
              onPageChange={pageChange}
              onPageSizeChange={pageSizeChange}
              onSortChange={sortChange}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
