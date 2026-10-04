import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApplicationServices, StudyGoal } from "@guesant/saberes-application";

export function useSaveStudyGoalMutation(services: ApplicationServices) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goal: StudyGoal) => services.goals.save.execute(goal),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({ queryKey: ["study", "goals"] });
    },
  });
}
