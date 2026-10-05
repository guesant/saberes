import { addPersonalProgressValue } from "./add-personal-progress-value.function";
import { getPersonalProgressLink } from "./get-personal-progress-link.function";
import type { PersonalProgressBuilderState } from "./personal-progress-builder-state.interface";
import type { StudySession } from "@guesant/saberes-application";

export function addPersonalProgressSession(
  state: PersonalProgressBuilderState,
  session: StudySession,
  contentKey: string | undefined = session.contentKey,
): void {
  if (!contentKey) {
    state.unlinkedSessionIds.push(session.id);

    return;
  }

  const link = getPersonalProgressLink(state, contentKey);

  addPersonalProgressValue(link.sessionIds, session.id);

  if (session.status === "completed") {
    link.completedSessionCount += 1;
  }

  if (contentKey.startsWith("question:")) {
    addPersonalProgressValue(link.questionKeys, contentKey);
  }
}
