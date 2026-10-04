import { saveQuestionDiagnosis } from "./save-question-diagnosis.function";
import type { ApplicationServices, DiagnosisCode } from "@guesant/saberes-application";

export type CreateQuestionDiagnosisInput = {
  attemptId: string | null;
  services: ApplicationServices;
};

export function createQuestionDiagnosisAction(
  input: CreateQuestionDiagnosisInput,
): (code: DiagnosisCode) => Promise<void> {
  const { attemptId, services } = input;

  return (code: DiagnosisCode): Promise<void> => {
    if (!attemptId) {
      return Promise.resolve();
    }

    return saveQuestionDiagnosis({ attemptId, code, services });
  };
}
