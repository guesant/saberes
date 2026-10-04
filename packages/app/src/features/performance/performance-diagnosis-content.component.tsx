import { PerformanceDiagnosisEmptyState } from "./performance-diagnosis-empty-state.component";
import { PerformanceDiagnosisRows } from "./performance-diagnosis-rows.component";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export type PerformanceDiagnosisContentProps = {
  onDecision(decision: PerformanceActionDecision): Promise<void>;
  stats: PerformanceDiagnosisStat[];
};

export function PerformanceDiagnosisContent(props: PerformanceDiagnosisContentProps) {
  return props.stats.length ? (
    <PerformanceDiagnosisRows onDecision={props.onDecision} stats={props.stats} />
  ) : (
    <PerformanceDiagnosisEmptyState />
  );
}
