import type { PerformanceFilter } from "./performance-filter.interface";
import type { MyStudyReadModel } from "../my-study/my-study-read-model.interface";
import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export interface PerformanceReadyViewDataInput {
  data: MyStudyReadModel;
  filter: PerformanceFilter;
  now: Date;
  actionForDiagnosis(code: DiagnosisCode): PedagogicalAction;
}
