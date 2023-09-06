import { useCallback } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PrimitiveAtom, useAtom } from 'jotai';
import { buildQuery, parseJson } from '@/lib/fetch-utils';
import { SearchApiResult, type SearchState } from '@/types/search';

export type UseListDataConfig<TData, TSearchState extends SearchState = SearchState> = {
  atom: PrimitiveAtom<TSearchState>;
  baseUrl: string;
  getItems?: (data: SearchApiResult<TData>) => TData[];
  getMeta?: (data: SearchApiResult<TData>) => Partial<SearchState>;
  forceForm?: Record<string, unknown>;
};

export default function useListData<TData, TSearchState extends SearchState = SearchState>(
  {
    atom,
    baseUrl,
    getItems = (data: SearchApiResult<TData>) => data.items,
    getMeta = (data: SearchApiResult<TData>) => data.meta,
    forceForm,
  }: UseListDataConfig<TData, TSearchState>,
  queryOptions?: Omit<UseQueryOptions<{ items: TData[] }>, 'initialData' | 'queryFn' | 'queryKey'>
) {
  const [searchState, setState] = useAtom(atom);
  const { form, sort, page, pageSize, totalElements, totalPages, numberOfElements, ...others } = searchState;
  // console.log('searchState', page);
  const querystring = buildQuery({
    form: {
      ...form,
      ...forceForm,
    },
    sort,
    page,
    pageSize,
  });
  const queryKey = `${baseUrl}?${querystring}`;

  const { data, isPreviousData, isPlaceholderData, isInitialLoading, ...result } = useQuery<{ items: TData[] }>({
    queryKey: [baseUrl, querystring],
    queryFn: () =>
      fetch(`${baseUrl}?${querystring}`)
        .then((resp) => (resp.ok ? parseJson<SearchApiResult<TData>>(resp) : Promise.reject(resp)))
        .then((data) => {
          const items = getItems(data);
          const meta = getMeta(data);
          setState((state) => ({
            ...state,
            ...meta,
            numberOfElements: items?.length ?? 0,
          }));
          return { items };
        }),
    initialData: { items: [] },
    keepPreviousData: true,
    // placeholderData: () => ({ items: [] }),
    // placeholderData: (previousData) => previousData,
    ...queryOptions,
  });
  // console.log({ isPreviousData, isPlaceholderData, isInitialLoading, items: data?.items ?? [] });

  const pageChange = useCallback(
    (newPage: number) => {
      // console.log('pageChange', { page: newPage });
      setState((state) => ({ ...state, page: newPage }));
    },
    [setState]
  );
  const pageSizeChange = useCallback(
    (newPageSize: number) => setState((state) => ({ ...state, pageSize: newPageSize, page: 0 })),
    [setState]
  );
  const sortChange = useCallback(
    (sort: { key: string; asc: boolean }) => setState((state) => ({ ...state, sort })),
    [setState]
  );
  const searchChange = useCallback(
    (values: Record<string, unknown>) => {
      setState((state) => ({
        ...state,
        form: {
          ...values,
          ...forceForm,
          _t: Date.now(), // append timestamp to force refetch
        },
        page: 0,
      }));
    },
    [setState, forceForm]
  );
  return {
    ...result,
    data: {
      form,
      sort,
      page,
      pageSize,
      totalElements,
      totalPages,
      numberOfElements,
      ...others,
      ...data,
    },
    queryKey,
    pageChange,
    pageSizeChange,
    sortChange,
    searchChange,
  };
}
