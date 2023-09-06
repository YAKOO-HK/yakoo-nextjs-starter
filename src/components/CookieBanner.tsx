'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchResponseHandler } from '@/lib/fetch-utils';

export function CookieBanner() {
  const queryClient = useQueryClient();
  const { data: accepted } = useQuery({
    queryKey: ['/api/accept-cookie'],
    queryFn: async () => {
      const { accepted } = await fetch('/api/accept-cookie').then(fetchResponseHandler<{ accepted: boolean }>());
      return accepted;
    },
    initialData: true,
  });
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await fetch('/api/accept-cookie', { method: 'POST' });
    },
    onMutate: async () => {
      await queryClient.cancelQueries(['/api/accept-cookie']);
      const previousValue = queryClient.getQueryData(['/api/accept-cookie']);
      queryClient.setQueryData(['/api/accept-cookie'], true);
      return { previousValue };
    },
  });

  if (accepted) {
    return null;
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-t-primary text-foreground">
      <div className="container flex max-w-screen-xl flex-col gap-2 py-2 lg:flex-row lg:gap-4">
        <p className="grow text-sm lg:text-base">
          This website uses cookies to ensure you get the best experience on our website. These may include cookies from
          3rd-party websites (e.g. Google Analytics). By using this website you consent to the use of these cookies.
        </p>
        <div className="flex flex-col lg:pr-2">
          <Button onClick={() => mutateAsync()}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
