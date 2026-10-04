import { useQuery } from "@tanstack/react-query";
import type { ApplicationServices, StudyGoal } from "@guesant/saberes-application";

export function useStudyGoalsQuery(services: ApplicationServices) {
  return useQuery<StudyGoal[], Error>({
    queryKey: ["study", "goals"],
    queryFn: () => services.goals.list.execute(),
  });
}
