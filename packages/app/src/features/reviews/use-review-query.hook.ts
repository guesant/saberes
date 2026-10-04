import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, ReviewTarget } from "@guesant/saberes-application";

export function useReviewQuery(services: ApplicationServices) {
  return useQuery<ReviewTarget[]>({
    queryKey: ["progress", "reviews"],
    queryFn: () => services.progress.listReviewTargets.execute(),
  });
}
