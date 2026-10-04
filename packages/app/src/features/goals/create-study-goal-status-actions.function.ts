import { StudyGoalStatus } from "@guesant/saberes-application";
import { updateStudyGoalStatus } from "./update-study-goal-status.function";
import type { StudyGoalsActionDependencies } from "./study-goals-action-dependencies.interface";
import type { UseStudyGoalsViewModel } from "./study-goals.view-model";

export function createStudyGoalStatusActions(
  input: StudyGoalsActionDependencies,
): Pick<UseStudyGoalsViewModel, "archive" | "complete" | "pause" | "restore" | "resume"> {
  const update = async (contentKey: string, status: StudyGoalStatus): Promise<void> => {
    const goal = input.goals.find((item) => {
      return item.contentKey === contentKey;
    });

    if (goal) {
      await input.save(updateStudyGoalStatus({ goal, now: new Date()
        .toISOString(), status }));
    }
  };

  return {
    archive: (contentKey) => {
      return update(contentKey, input.status.Archived);
    },
    complete: (contentKey) => {
      return update(contentKey, input.status.Completed);
    },
    pause: (contentKey) => {
      return update(contentKey, input.status.Paused);
    },
    restore: (contentKey) => {
      return update(contentKey, input.status.Active);
    },
    resume: (contentKey) => {
      return update(contentKey, input.status.Active);
    },
  };
}
