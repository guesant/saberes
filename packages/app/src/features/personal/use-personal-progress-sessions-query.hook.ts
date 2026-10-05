import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function usePersonalProgressSessionsQuery(services: ApplicationServices) {
  return useQuery({
    queryFn: () => {
      return services.progress.listStudySessions.execute();
    },
    queryKey: ["personal-progress", "sessions"],
    staleTime: Infinity,
  });
}
