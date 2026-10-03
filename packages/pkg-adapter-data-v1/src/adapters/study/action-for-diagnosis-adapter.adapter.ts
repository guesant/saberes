import { actionForDiagnosis } from "@guesant/saberes-domain";
import type { ActionForDiagnosisPort } from "@guesant/saberes-application";

export class ActionForDiagnosisAdapter implements ActionForDiagnosisPort {
  public execute(
    input: Parameters<ActionForDiagnosisPort["execute"]>[0],
  ): ReturnType<ActionForDiagnosisPort["execute"]> {
    return actionForDiagnosis(input);
  }
}
