import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  packages: ['packages'] as const,
  bookings: ['bookings'] as const,
  reviews: ['reviews'] as const,
  users: ['users'] as const,
  messages: ['messages'] as const,
  dashboardStats: ['dashboard-stats'] as const,
} as const;