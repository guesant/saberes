import { addPersonalProgressSession } from "./add-personal-progress-session.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { StudySession } from "@guesant/saberes-application";

export function addPersonalProgressSessionEvidence(
  state: PersonalProgressBuilderState,
  sessions: StudySession[],
): void {
  for (const session of sessions) {
    addPersonalProgressSession(state, session);

    for (const questionKey of session.questionKeys ?? []) {
      addPersonalProgressSession(state, session, questionKey);
    }
  }
}
