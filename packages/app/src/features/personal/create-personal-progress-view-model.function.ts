import { createPersonalProgressReadModel } from "./create-personal-progress-read-model.function";
import { getPersonalProgressViewState } from "./get-personal-progress-view-state.function";
import type { CreatePersonalProgressViewModelInput } from "./create-personal-progress-view-model-input.interface";
import type { PersonalProgressViewModel } from "./personal-progress-view-model.interface";

export function createPersonalProgressViewModel(
  input: CreatePersonalProgressViewModelInput,
): PersonalProgressViewModel {
  const {error} = input.queries;

  return {
    data: createPersonalProgressReadModel({
      activities: input.workspace.activities,
      attempts: input.queries.attempts ?? [],
      goals: input.queries.goals ?? [],
      sessions: input.queries.sessions ?? [],
    }),
    error,
    reload: input.queries.reload,
    state: getPersonalProgressViewState(input.queries.isPending, error),
  };
}
