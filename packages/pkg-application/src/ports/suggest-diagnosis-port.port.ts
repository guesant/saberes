import type { Attempt } from "../models/index";

export interface SuggestDiagnosisPort {
  execute(attempt: Pick<Attempt, "isCorrect" | "elapsedMs" | "attemptNumber">): string;
}
