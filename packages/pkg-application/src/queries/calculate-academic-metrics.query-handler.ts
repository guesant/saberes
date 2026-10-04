import type { CalculateAcademicMetricsPort } from "../ports/index";
import type { AcademicMetrics, CalculateAcademicMetricsInput } from "@guesant/saberes-domain";

export class CalculateAcademicMetricsQueryHandler {
  public constructor(private readonly port: CalculateAcademicMetricsPort) {}

  public execute(input: CalculateAcademicMetricsInput): AcademicMetrics {
    return this.port.execute(input);
  }
}
