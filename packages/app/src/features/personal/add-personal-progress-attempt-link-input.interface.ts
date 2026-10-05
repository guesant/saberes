import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { Attempt } from "@guesant/saberes-application";

export interface AddPersonalProgressAttemptLinkInput {
  state: PersonalProgressBuilderState;
  attempt: Attempt;
  attemptKey: string;
}
