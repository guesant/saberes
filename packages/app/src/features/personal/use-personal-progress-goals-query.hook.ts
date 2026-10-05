import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices } from "@guesant/saberes-application";

export function usePersonalProgressGoalsQuery(services: ApplicationServices) {
  return useQuery({
    queryFn: () => {
      return services.goals.list.execute();
    },
    queryKey: ["personal-progress", "goals"],
    staleTime: Infinity,
  });
}
