import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-domain";

export interface ActionForDiagnosisPort {
  execute(code: DiagnosisCode): PedagogicalAction;
}
