import type { IsCalculationProjectionCurrentInput } from "./is-calculation-projection-current-input.interface";

export function isCalculationProjectionCurrent(input: IsCalculationProjectionCurrentInput): boolean {
  return (
    input.metadata.status === "current" &&
    !input.metadata.invalidatedAt &&
    input.metadata.origin.kind === input.currentOrigin.kind &&
    input.metadata.origin.reference === input.currentOrigin.reference &&
    input.metadata.ruleVersion.identifier === input.currentRuleVersion.identifier &&
    input.metadata.ruleVersion.version === input.currentRuleVersion.version
  );
}
