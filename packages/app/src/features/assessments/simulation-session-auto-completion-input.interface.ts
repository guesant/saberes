import type { StudySession } from "@guesant/saberes-application";

export interface SimulationSessionAutoCompletionInput {
  session: StudySession | null;
  remainingSeconds: number | null;
  completeSession(): Promise<void>;
}
