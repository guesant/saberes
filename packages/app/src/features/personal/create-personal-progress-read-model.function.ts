import { addPersonalProgressActivityEvidence } from "./add-personal-progress-activity-evidence.function";
import { addPersonalProgressAttemptEvidence } from "./add-personal-progress-attempt-evidence.function";
import { addPersonalProgressGoalEvidence } from "./add-personal-progress-goal-evidence.function";
import { addPersonalProgressSessionEvidence } from "./add-personal-progress-session-evidence.function";
import { buildPersonalProgressReadModel } from "./build-personal-progress-read-model.function";
import { createPersonalProgressBuilderState } from "./create-personal-progress-builder-state.function";
import type { CreatePersonalProgressReadModelInput } from "./create-personal-progress-read-model-input.interface";
import type { PersonalProgressReadModel } from "./personal-progress-read-model.interface";

export function createPersonalProgressReadModel(
  input: CreatePersonalProgressReadModelInput,
): PersonalProgressReadModel {
  const state = createPersonalProgressBuilderState();

  addPersonalProgressSessionEvidence(state, input.sessions);

  addPersonalProgressAttemptEvidence(state, input.attempts);

  addPersonalProgressGoalEvidence(state, input.goals);

  addPersonalProgressActivityEvidence(state, input.activities);

  return buildPersonalProgressReadModel(state);
}
