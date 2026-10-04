import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, Attempt, ReviewTarget } from "@guesant/saberes-application";

export type MyStudyActivityQueries = {
  attempts: Attempt[] | undefined;
  reviews: ReviewTarget[] | undefined;
  attemptsError: Error | null;
  reviewsError: Error | null;
  reload: () => Promise<void>;
};

export function useMyStudyActivityQueries(services: ApplicationServices): MyStudyActivityQueries {
  const attemptsQuery = useQuery({
    queryKey: ["progress", "attempts"],
    queryFn: () => services.progress.listAttempts.execute(),
  });

  const reviewsQuery = useQuery({
    queryKey: ["progress", "reviews"],
    queryFn: () => services.progress.listReviewTargets.execute(),
  });

  return {
    attempts: attemptsQuery.data,
    reviews: reviewsQuery.data,
    attemptsError: attemptsQuery.error,
    reviewsError: reviewsQuery.error,
    reload: async (): Promise<void> => {
      await Promise.all([attemptsQuery.refetch(), reviewsQuery.refetch()]);
    },
  };
}
