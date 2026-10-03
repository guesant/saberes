import { suggestDiagnosis } from "@guesant/saberes-domain";
import type { SuggestDiagnosisPort } from "@guesant/saberes-application";

export class SuggestDiagnosisAdapter implements SuggestDiagnosisPort {
  public execute(
    input: Parameters<SuggestDiagnosisPort["execute"]>[0],
  ): ReturnType<SuggestDiagnosisPort["execute"]> {
    return suggestDiagnosis(input);
  }
}
