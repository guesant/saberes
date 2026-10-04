import type { DiagnosisLabelKey } from "./diagnosis-label-key.type";
import type { DiagnosisCode } from "@guesant/saberes-application";

export type DiagnosisOption = {
  code: DiagnosisCode;
  labelKey: DiagnosisLabelKey;
};
