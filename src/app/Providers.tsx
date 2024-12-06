'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { SessionProvider } from 'next-auth/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const myStore = createStore();

export const Providers = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SessionProvider refetchOnWindowFocus>
      <JotaiProvider store={myStore}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </JotaiProvider>
    </SessionProvider>
  );
};
