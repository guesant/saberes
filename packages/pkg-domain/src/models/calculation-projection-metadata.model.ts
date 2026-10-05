import type { CalculationOrigin } from "./calculation-origin.model";
import type { CalculationProjectionStatus } from "./calculation-projection-status.type";
import type { CalculationRuleVersion } from "./calculation-rule-version.model";

export interface CalculationProjectionMetadata {
  readonly calculatedAt: string;
  readonly invalidatedAt?: string;
  readonly origin: CalculationOrigin;
  readonly ruleVersion: CalculationRuleVersion;
  readonly status: CalculationProjectionStatus;
}
