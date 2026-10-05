import type { CalculationOrigin } from "../models/calculation-origin.model";
import type { CalculationProjectionMetadata } from "../models/calculation-projection-metadata.model";
import type { CalculationRuleVersion } from "../models/calculation-rule-version.model";

export interface IsCalculationProjectionCurrentInput {
  currentOrigin: CalculationOrigin;
  currentRuleVersion: CalculationRuleVersion;
  metadata: CalculationProjectionMetadata;
}
