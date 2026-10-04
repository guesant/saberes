import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, StudyRecord } from "@guesant/saberes-application";

export type MyStudyMasteryQueries = {
  error: Error | null;
  topicMastery: StudyRecord[] | undefined;
  reload: () => Promise<void>;
};

export function useMyStudyMasteryQueries(services: ApplicationServices): MyStudyMasteryQueries {
  const topicMasteryQuery = useQuery({
    queryKey: ["progress", "topic-mastery"],
    queryFn: () => services.progress.listTopicMastery.execute(),
  });

  return {
    error: topicMasteryQuery.error,
    reload: async (): Promise<void> => {
      await topicMasteryQuery.refetch();
    },
    topicMastery: topicMasteryQuery.data,
  };
}
