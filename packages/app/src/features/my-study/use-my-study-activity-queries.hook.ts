import { useQuery } from "@tanstack/react-query";
import type {
  ApplicationServices,
  Attempt,
  ReviewTarget,
  StudySession,
} from "@guesant/saberes-application";

export type MyStudyActivityQueries = {
  attempts: Attempt[] | undefined;
  reviews: ReviewTarget[] | undefined;
  sessions: StudySession[] | undefined;
  attemptsError: Error | null;
  reviewsError: Error | null;
  sessionsError: Error | null;
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

  const sessionsQuery = useQuery({
    queryKey: ["progress", "sessions"],
    queryFn: () => services.progress.listStudySessions.execute(),
  });

  return {
    attempts: attemptsQuery.data,
    reviews: reviewsQuery.data,
    sessions: sessionsQuery.data,
    attemptsError: attemptsQuery.error,
    reviewsError: reviewsQuery.error,
    sessionsError: sessionsQuery.error,
    reload: async (): Promise<void> => {
      await Promise.all([attemptsQuery.refetch(), reviewsQuery.refetch(), sessionsQuery.refetch()]);
    },
  };
}
