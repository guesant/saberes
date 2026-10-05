import type { CalculationHypothesisEntry } from "./calculation-hypothesis-entry.model";

export interface CalculationHypothesis {
  readonly createdAt: string;
  readonly entries: CalculationHypothesisEntry[];
  readonly identifier: string;
  readonly label: string;
}
