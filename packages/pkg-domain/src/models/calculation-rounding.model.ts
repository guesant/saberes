import type { CalculationPrecision } from "./calculation-precision.model";

export interface CalculationRounding {
  readonly mode: "half-up" | "truncate";
  readonly precision: CalculationPrecision;
}
