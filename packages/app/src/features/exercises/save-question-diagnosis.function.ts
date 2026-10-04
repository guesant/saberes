import {
  DiagnosisSource,
  type ApplicationServices,
  type DiagnosisCode,
} from "@guesant/saberes-application";

export type SaveQuestionDiagnosisInput = {
  attemptId: string;
  code: DiagnosisCode;
  services: ApplicationServices;
};

export function saveQuestionDiagnosis(input: SaveQuestionDiagnosisInput): Promise<void> {
  const { attemptId, code, services } = input;

  const action = services.study.actionForDiagnosis.execute(code);

  return services.progress.saveDiagnosis.execute({
    action,
    attemptId,
    code,
    suggestedBy: DiagnosisSource.Student,
  });
}
