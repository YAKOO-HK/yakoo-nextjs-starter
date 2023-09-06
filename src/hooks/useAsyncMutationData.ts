import { QueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type DeepPartial } from 'react-hook-form';
import SuperJSON from 'superjson';
import { useToast } from '@/components/ui/use-toast';
import { fetchResponseHandler } from '@/lib/fetch-utils';

function useAsyncMutationData<TData, TVariables = DeepPartial<TData>>({
  url,
  successMessage = 'Data updated successfully.',
  onSuccess,
  queryOptions,
  useSuperJson = true,
  method = 'PATCH',
  disableToast,
}: {
  url: string;
  successMessage?: React.ReactNode;
  onSuccess?: (data: TData) => any;
  queryOptions?: QueryOptions<TData>;
  method?: 'PATCH' | 'PUT' | 'POST';
  useSuperJson?: boolean;
  disableToast?: boolean;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryResult = useQuery<TData>({
    queryKey: [url],
    queryFn: () => fetch(url).then(fetchResponseHandler<TData>()),
    ...queryOptions,
  });
  const { mutateAsync } = useMutation<TData, unknown, TVariables>({
    mutationFn: (values) =>
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: useSuperJson ? SuperJSON.stringify(values) : JSON.stringify(values),
      }).then(fetchResponseHandler<TData>(useSuperJson)),
    onSuccess: (data) => {
      queryClient.setQueryData([url], data);
      !disableToast && toast({ description: successMessage });
      onSuccess?.(data);
    },
  });
  return { ...queryResult, mutateAsync };
}

export { useAsyncMutationData };
