import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";

export interface AddPersonalProgressTopicEvidenceInput {
  state: PersonalProgressBuilderState;
  topicId: number | string;
  attemptKey: string;
  isCorrect: boolean | null | undefined;
  sessionId: string | undefined;
}
