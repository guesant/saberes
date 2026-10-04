import { calculateAcademicMetrics } from "@guesant/saberes-domain";
import type { CalculateAcademicMetricsPort } from "@guesant/saberes-application";
import type { AcademicMetrics, CalculateAcademicMetricsInput } from "@guesant/saberes-domain";

export class CalculateAcademicMetricsAdapter implements CalculateAcademicMetricsPort {
  public execute(input: CalculateAcademicMetricsInput): AcademicMetrics {
    return calculateAcademicMetrics(input);
  }
}
