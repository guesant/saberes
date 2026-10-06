import type { StudySession } from "@guesant/saberes-application";

export function shouldLoadSimulationQuestion(questionKey: string, session: StudySession | null): boolean {
  return Boolean(questionKey) && session?.status !== "completed";
}
