import type { Attempt } from "../models/index.ts";
import type { SuggestDiagnosisPort } from "../ports/index.ts";

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
