import { QueryClient } from "@tanstack/react-query";
import { getLocalQueryRetryDelay } from "./get-local-query-retry-delay.function";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60,
      retry: 2,
      retryDelay: getLocalQueryRetryDelay,
      refetchOnWindowFocus: false,
    },
  },
});
