import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function usePersonalProgressAttemptsQuery(services: ApplicationServices) {
  return useQuery({
    queryFn: () => {
      return services.progress.listAttempts.execute();
    },
    queryKey: ["personal-progress", "attempts"],
    staleTime: Infinity,
  });
}
