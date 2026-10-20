import type { ComponentType, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/** retry:false, gcTime:0, staleTime:0 for queries and mutations. */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function createQueryWrapper(client: QueryClient = createTestQueryClient()): {
  client: QueryClient;
  wrapper: ComponentType<{ children: ReactNode }>;
} {
  function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return { client, wrapper: QueryWrapper };
}
