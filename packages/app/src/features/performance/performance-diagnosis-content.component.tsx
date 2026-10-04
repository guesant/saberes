import { PerformanceDiagnosisEmptyState } from "./performance-diagnosis-empty-state.component";
import { PerformanceDiagnosisRows } from "./performance-diagnosis-rows.component";
import type { PerformanceDiagnosisStat } from "./performance-diagnosis-stat.interface";

export type PerformanceDiagnosisContentProps = {
  stats: PerformanceDiagnosisStat[];
};

export function PerformanceDiagnosisContent(props: PerformanceDiagnosisContentProps) {
  return props.stats.length ? (
    <PerformanceDiagnosisRows stats={props.stats} />
  ) : (
    <PerformanceDiagnosisEmptyState />
  );
}
