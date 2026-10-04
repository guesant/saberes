import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export type PerformanceDiagnosisStatRowProps = {
  onDecision(decision: PerformanceActionDecision): Promise<void>;
  stat: PerformanceDiagnosisStat;
};
