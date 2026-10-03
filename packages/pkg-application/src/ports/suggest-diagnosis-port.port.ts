import type { Attempt } from "../models/progress.models.ts";

export interface SuggestDiagnosisPort {
  execute(attempt: Pick<Attempt, "isCorrect" | "elapsedMs" | "attemptNumber">): string;
}
