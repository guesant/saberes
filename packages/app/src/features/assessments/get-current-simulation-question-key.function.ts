import type { StudySession } from "@guesant/saberes-application";

export function getCurrentSimulationQuestionKey(session: StudySession | null): string {
  if (!session) {
    return "";
  }

  const questionIndex = session.currentIndex ?? 0;

  const questionKey = session.questionKeys?.[questionIndex];

  return questionKey ?? "";
}
