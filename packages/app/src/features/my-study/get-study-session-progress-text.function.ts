import type { StudySession } from "@guesant/saberes-application";

export function getStudySessionProgressText(session: StudySession): string {
  if (!session.questionKeys?.length) {
    return "";
  }

  return ` · ${session.answeredQuestionKeys?.length || 0}/${session.questionKeys.length}`;
}
