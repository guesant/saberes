import type { SuggestDiagnosisPort } from "../application.ports.ts";
import type { Attempt } from "../models/progress.models.ts";

export interface SuggestDiagnosisInput {
  isCorrect: boolean | null;
  elapsedMs: number;
  attemptNumber: number;
}

export class SuggestDiagnosisQueryHandler {
  public constructor(private readonly port: SuggestDiagnosisPort) {}

  public execute(attempt: SuggestDiagnosisInput): string {
    return this.port.execute(attempt as Pick<Attempt, "isCorrect" | "elapsedMs" | "attemptNumber">);
  }
}
