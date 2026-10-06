import type { DiagnosisOption } from "./diagnosis-option.type";
import type { DiagnosisCode } from "@guesant/saberes-application";

export interface QuestionDiagnosisModalState {
  error: boolean;
  open: boolean;
  options: DiagnosisOption[];
  saved: boolean;
  saving: boolean;
  selectedCode: DiagnosisCode | null;
  closeDialog(): void;

  openDialog(): void;

  saveDiagnosis(): Promise<void>;

  selectCode(code: DiagnosisCode): void;
}
