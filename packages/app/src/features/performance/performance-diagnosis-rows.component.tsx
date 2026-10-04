import { PerformanceDiagnosisStatRow } from "./performance-diagnosis-stat-row.component";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export type PerformanceDiagnosisRowsProps = {
  onDecision(decision: PerformanceActionDecision): Promise<void>;
  stats: PerformanceDiagnosisStat[];
};

export function PerformanceDiagnosisRows(props: PerformanceDiagnosisRowsProps) {
  return props.stats
    .slice(0, 5)
    .map((stat) => (
      <PerformanceDiagnosisStatRow key={stat.code} onDecision={props.onDecision} stat={stat} />
    ));
}
