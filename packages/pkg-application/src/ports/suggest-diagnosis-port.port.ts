import type { Attempt } from "../models/index.ts";

export interface SuggestDiagnosisPort {
  execute(attempt: Pick<Attempt, "isCorrect" | "elapsedMs" | "attemptNumber">): string;
}
