import * as React from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { cva, VariantProps } from 'class-variance-authority';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PageSelect } from './pagination';
import { getAriaSort, SortLabel } from './sort';

const tableVariants = cva('w-full border border-border text-sm', {
  variants: {
    size: {
      default: 'table-default',
      small: 'table-small',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-muted data-[state-selected="true"]:bg-muted/50', className)} {...props}>
      {children}
    </tr>
  );
}
export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        'border-y border-border px-[var(--td-px)] py-[var(--td-py)] [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
export function TableHeaderCell({ className, children, ...props }: TableHeaderCellProps) {
  return (
    <th
      className={cn(
        'border-y border-border px-[var(--td-px)] py-[var(--td-py)] text-left align-middle font-medium [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}
// determine the "Select All" checkbox state
function getSelectAllCheckboxState(numSelected: number, rowCount: number) {
  if (numSelected === 0) {
    return false;
  }
  if (numSelected === rowCount) {
    return true;
  }
  return 'indeterminate';
}

export interface EnhancedTableHeadProps extends React.TableHTMLAttributes<HTMLTableSectionElement> {
  onSelectAllClick: (checked: CheckedState) => void;
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order?: 'asc' | 'desc';
  orderBy?: string;
  columnData: ColumnData[];
  numSelected: number;
  rowCount: number;
  noCheckbox?: boolean;
}

export function EnhancedTableHead({
  onSelectAllClick,
  onRequestSort,
  order,
  orderBy,
  numSelected,
  rowCount,
  columnData,
  noCheckbox = false,
  ...props
}: EnhancedTableHeadProps) {
  return (
    <thead {...props}>
      <tr className="m-0 p-0">
        {!noCheckbox && (
          <TableHeaderCell>
            <Checkbox
              checked={getSelectAllCheckboxState(numSelected, rowCount)}
              onCheckedChange={onSelectAllClick}
              className="h-5 w-5 rounded-md"
            />
          </TableHeaderCell>
        )}
        {columnData.map((column) => (
          <TableHeaderCell
            {...column.headerProps}
            key={column.id}
            aria-sort={getAriaSort(orderBy === column.id, order)}
          >
            {column.sortable ? (
              <SortLabel
                active={orderBy === column.id}
                direction={order}
                className="font-medium"
                onClick={(event) => onRequestSort(event, column.id)}
              >
                {column.label}
              </SortLabel>
            ) : (
              column.label
            )}
          </TableHeaderCell>
        ))}
      </tr>
    </thead>
  );
}

export interface TablePaginationProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  count: number;
  page: number;
  labelRowsPerPage?: string;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
}

export interface RowsPerPageSelectProps {
  rowsPerPage: number;
  rowsPerPageOptions: number[];
  labelRowsPerPage?: string;
  onRowsPerPageChange: (pageSize: number) => void;
  className?: string;
}
export function RowsPerPageSelect({
  rowsPerPage,
  rowsPerPageOptions,
  labelRowsPerPage = 'Rows per page:',
  onRowsPerPageChange,
  className,
}: RowsPerPageSelectProps) {
  const id = React.useId();
  return (
    <div className={cn('flex items-center space-x-1 py-1', className)}>
      <label htmlFor={id} className="mr-1 block text-gray-500">
        {labelRowsPerPage}
      </label>
      <Select value={`${rowsPerPage}`} onValueChange={(value: string) => onRowsPerPageChange(Number(value))}>
        <SelectTrigger id={id} className="h-9 w-16 px-2 py-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-96 min-w-[6rem] overflow-y-auto">
          {rowsPerPageOptions.map((option) => (
            <SelectItem key={option} value={`${option}`}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function TablePagination({
  count,
  page,
  labelRowsPerPage,
  rowsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
  ...props
}: TablePaginationProps) {
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  return (
    <td {...props}>
      <div className="flex flex-row items-center justify-end gap-3">
        {!!rowsPerPageOptions?.length && (
          <RowsPerPageSelect
            labelRowsPerPage={labelRowsPerPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={onRowsPerPageChange}
            className="hidden sm:flex"
          />
        )}
        <p className="hidden text-sm text-gray-700 sm:block">
          {`${page * rowsPerPage + 1} - ${Math.min(count, (page + 1) * rowsPerPage)} of ${count}`}
        </p>
        <nav className="inline-flex items-center -space-x-1" aria-label="Pagination">
          <Button onClick={() => onPageChange(0)} disabled={page === 0} variant="ghost" size="icon">
            <ChevronsLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">First</span>
          </Button>
          <Button onClick={() => onPageChange(Math.max(0, page - 1))} disabled={page === 0} variant="ghost" size="icon">
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </Button>
          <div className="min-w-[4rem] py-1">
            <PageSelect
              disabled={lastPage <= 1}
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onPageChange}
            />
          </div>
          <Button
            onClick={() => onPageChange(Math.min(lastPage, page + 1))}
            disabled={page >= lastPage}
            variant="ghost"
            size="icon"
          >
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </Button>
          <Button onClick={() => onPageChange(lastPage)} disabled={page >= lastPage} variant="ghost" size="icon">
            <ChevronsRightIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Last</span>
          </Button>
        </nav>
      </div>
    </td>
  );
}

export type RenderRowFunc<TRowData, TRowProps> = (rowProps: {
  rowData: TRowData;
  rowIndex: number;
  rowProps?: TRowProps;
  noCheckbox?: boolean;
  selectedRows: TRowData[];
  setSelectedRows: React.Dispatch<React.SetStateAction<TRowData[]>>;
}) => React.ReactNode;
export interface EnhancedTableHandles<TRowData> {
  getSelectedRows: () => TRowData[];
}
export interface EnhancedTableProps<TRowData, TRowProps>
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  columnData: ColumnData[];
  initialRowsSelected?: TRowData[];
  data: TRowData[];
  sort?: { key: string; asc: boolean };
  totalElements?: number;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onSortChange?: (sort: { key: string; asc: boolean }) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  renderRow: RenderRowFunc<TRowData, TRowProps>;
  renderRowProps?: TRowProps;
  noCheckbox?: boolean;
  noPagination?: boolean;
  isLoading?: boolean;
}
function EnhancedTableInner<TRowData, TRowProps>(
  {
    columnData,
    className,
    size,
    initialRowsSelected = [],
    data = [],
    sort,
    page = 0,
    pageSize = 20,
    pageSizeOptions,
    totalElements = 0,
    onSortChange,
    onPageChange,
    onPageSizeChange,
    renderRow,
    renderRowProps,
    noCheckbox = false,
    noPagination = false,
    isLoading = false,
    children,
    ...props
  }: EnhancedTableProps<TRowData, TRowProps>,
  ref: React.ForwardedRef<EnhancedTableHandles<TRowData>>
) {
  const [selectedRows, setSelectedRows] = React.useState(initialRowsSelected);
  const onSelectAllClick = () => {
    if (selectedRows.length < data.length) {
      setSelectedRows(data.slice());
    } else {
      setSelectedRows([]);
    }
  };

  React.useImperativeHandle(
    ref,
    () => {
      return {
        getSelectedRows: () => selectedRows,
      };
    },
    [selectedRows]
  );

  const handleChangeSort = React.useCallback(
    (event: React.MouseEvent<unknown>, property: string) => {
      const newSort = {
        key: property,
        asc: sort?.key === property ? !sort?.asc : true,
      };
      onSortChange?.(newSort);
    },
    [onSortChange, sort?.key, sort?.asc]
  );

  const handleChangePage = React.useCallback(
    (nextPage: number) => {
      setSelectedRows([]); // clear selection;
      onPageChange?.(nextPage);
    },
    [onPageChange]
  );

  const handleChangePageSize = React.useCallback(
    (nextPageSize: number) => {
      setSelectedRows([]); // clear selection;
      onPageSizeChange?.(nextPageSize);
    },
    [onPageSizeChange]
  );

  return (
    <table className={tableVariants({ size, className })} {...props}>
      <EnhancedTableHead
        noCheckbox={noCheckbox}
        columnData={columnData}
        order={sort?.asc ? 'asc' : 'desc'}
        orderBy={sort?.key}
        rowCount={data.length}
        numSelected={selectedRows.length}
        onSelectAllClick={onSelectAllClick}
        onRequestSort={handleChangeSort}
      />
      <tbody>
        {!data.length && (
          <tr>
            <TableCell colSpan={columnData.length + (noCheckbox ? 0 : 1)}>
              {isLoading ? <Skeleton className="h-6 w-full" /> : 'No records.'}
            </TableCell>
          </tr>
        )}
        {data.map((rowData, rowIndex) =>
          renderRow({ rowData, rowIndex, selectedRows, setSelectedRows, noCheckbox, rowProps: renderRowProps })
        )}
      </tbody>
      <tfoot>
        {!noPagination && (
          <tr>
            <TablePagination
              colSpan={columnData.length + (noCheckbox ? 0 : 1)}
              count={totalElements}
              page={page}
              rowsPerPage={pageSize}
              rowsPerPageOptions={pageSizeOptions}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangePageSize}
            />
          </tr>
        )}
      </tfoot>
    </table>
  );
}

// https://fettblog.eu/typescript-react-generic-forward-refs/: Option 1
export const EnhancedTable = React.forwardRef<EnhancedTableHandles<any>, EnhancedTableProps<any, any>>(
  EnhancedTableInner
) as <TRowData, TRowProps>(
  props: EnhancedTableProps<TRowData, TRowProps> & React.RefAttributes<EnhancedTableHandles<TRowData>>
) => React.ReactElement;

export interface ColumnData {
  id: string;
  label: React.ReactNode;
  sortable?: boolean;
  headerProps?: Partial<TableHeaderCellProps>;
}
