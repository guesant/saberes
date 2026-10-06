import type { DiagnosisCode } from "@guesant/saberes-application";

export interface QuestionDiagnosisPanelProps {
  onDiagnose(code: DiagnosisCode): Promise<void>;
  result: boolean | null;
}
