import type { StudySession } from "@guesant/saberes-application";

export function getQuestionSessionCurrentIndex(session: StudySession | null): number {
  return session?.currentIndex ?? 0;
}
