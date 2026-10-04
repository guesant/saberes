import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, StudyRecord } from "@guesant/saberes-application";

export type MyStudyAchievementQueries = {
  streak: StudyRecord | undefined;
  achievements: StudyRecord[] | undefined;
  streakError: Error | null;
  achievementsError: Error | null;
  reload: () => Promise<void>;
};

export function useMyStudyAchievementQueries(
  services: ApplicationServices,
): MyStudyAchievementQueries {
  const streakQuery = useQuery({
    queryKey: ["progress", "streak"],
    queryFn: () => services.progress.getStreak.execute(),
  });

  const achievementsQuery = useQuery({
    queryKey: ["progress", "achievements"],
    queryFn: () => services.progress.listAchievements.execute(),
  });

  return {
    streak: streakQuery.data,
    achievements: achievementsQuery.data,
    streakError: streakQuery.error,
    achievementsError: achievementsQuery.error,
    reload: async (): Promise<void> => {
      await Promise.all([streakQuery.refetch(), achievementsQuery.refetch()]);
    },
  };
}
