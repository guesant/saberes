import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, ReviewTarget } from "@guesant/saberes-application";

export function useReviewQuery(services: ApplicationServices) {
  return useQuery<ReviewTarget[]>({
    queryKey: ["progress", "reviews"],
    queryFn: () => {
      return services.progress.listReviewTargets.execute();
    },
  });
}
