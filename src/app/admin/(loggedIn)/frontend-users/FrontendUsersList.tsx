'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { atom } from 'jotai';
import { PencilIcon, SendIcon } from 'lucide-react';
import type { AdminFrontendUserRow } from '@/app/api/admin/frontend-users/route';
import ConfirmButton from '@/components/ConfirmButton';
import { ControlledDatePickerField } from '@/components/form/ControlledDatePickerField';
import { ControlledDropdown } from '@/components/form/ControlledDropdown';
import { SimpleSearchForm } from '@/components/form/SimpleSearchForm';
import { EnhancedTable, TableCell, TableRow } from '@/components/list/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import useListData from '@/hooks/useListData';
import { fetchResponseHandler } from '@/lib/fetch-utils';
import { AdminFrontendUserSearchSchema, type AdminFrontendUserSearchParams } from '@/types/admin/frontend-users';
import { SearchState } from '@/types/search';
import { UpdateFrontendUserStatusDialog } from './UpdateFrontendUserStatusDialog';

const CLEAR_VALUES: AdminFrontendUserSearchParams = {
  username: '',
  name: '',
  email: '',
  status: '',
  dob: null,
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
  {
    name: 'dob',
    label: 'Date of Birth',
    FieldComponent: ControlledDatePickerField,
    captionLayout: 'dropdown-buttons',
    fromYear: 1900,
    toYear: new Date().getFullYear(),
    allowClear: true,
  },
];
const STATIC_FILTERS = ['username', 'name', 'email', 'dob', 'status'];

function UserSearchForm({
  form,
  onSearch,
}: {
  form: AdminFrontendUserSearchParams;
  onSearch: (params: AdminFrontendUserSearchParams) => any;
}) {
  return (
    <SimpleSearchForm
      zodSchema={AdminFrontendUserSearchSchema}
      defaultValues={{ ...CLEAR_VALUES, ...form }}
      onSearch={onSearch}
      clearValues={CLEAR_VALUES}
      availableFields={AVAILABLE_FIELDS}
      staticFilters={STATIC_FILTERS}
    />
  );
}

const UserRow = ({ rowData, refetch }: { rowData: AdminFrontendUserRow; refetch: () => void }) => {
  const { toast } = useToast();
  return (
    <TableRow>
      <TableCell>{rowData.username}</TableCell>
      <TableCell>{rowData.name}</TableCell>
      <TableCell>{rowData.email}</TableCell>
      <TableCell>{rowData.dob}</TableCell>
      <TableCell>
        <UpdateFrontendUserStatusDialog id={rowData.id} status={rowData.status} refetch={refetch} />
      </TableCell>
      <TableCell>{rowData.createdAt && format(rowData.createdAt, 'yyyy-MM-dd HH:mm:ss')}</TableCell>
      <TableCell>
        <div className="flex flex-row items-center space-x-2">
          <Button asChild title="Update" className="size-8 p-0">
            <Link href={`/admin/frontend-users/${rowData.id}`}>
              <PencilIcon className="size-4" />
              <span className="sr-only">Update</span>
            </Link>
          </Button>
          <ConfirmButton
            title="Reset Password"
            titleText="Reset Password"
            message="Are you sure you want to reset this user's password?"
            className="size-8 bg-yellow-700 p-0 text-white hover:bg-yellow-700/85"
            onConfirm={async () => {
              try {
                await fetch(`/api/admin/frontend-users/${rowData.id}/request-password-reset`, { method: 'POST' }).then(
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
        </div>
      </TableCell>
    </TableRow>
  );
};

const COLUMNS = [
  { id: 'username', label: 'Username', sortable: true },
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'dob', label: 'Date of Birth', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
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

export function FrontendUsersList() {
  const { data, isFetching, pageChange, pageSizeChange, sortChange, searchChange, refetch } =
    useListData<AdminFrontendUserRow>({
      atom: searchStateAtom,
      baseUrl: '/api/admin/frontend-users',
    });
  return (
    <>
      <UserSearchForm form={data.form} onSearch={searchChange} />
      <Card className="my-4">
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
    </>
  );
}
