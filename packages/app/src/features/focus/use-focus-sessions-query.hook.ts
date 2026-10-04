import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, FocusSession } from "@guesant/saberes-application";

export function useFocusSessionsQuery(services: ApplicationServices) {
  return useQuery<FocusSession[], Error>({
    queryKey: ["study", "focus"],
    queryFn: () => {
      return services.focus.list.execute();
    },
  });
}
