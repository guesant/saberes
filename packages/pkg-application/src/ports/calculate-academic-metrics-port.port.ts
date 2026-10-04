import type { AcademicMetrics, CalculateAcademicMetricsInput } from "@guesant/saberes-domain";

export interface CalculateAcademicMetricsPort {
  execute(input: CalculateAcademicMetricsInput): AcademicMetrics;
}
