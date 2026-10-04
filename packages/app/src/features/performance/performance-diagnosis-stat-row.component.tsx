import { UIContentGroup } from "@guesant/saberes-ui";
import { useState } from "react";
import { PerformanceDecisionSaved } from "./performance-decision-saved.component";
import { PerformanceDiagnosisStatActions } from "./performance-diagnosis-stat-actions.component";
import { PerformanceDiagnosisStatContent } from "./performance-diagnosis-stat-content.component";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";
import type { PerformanceDiagnosisStatRowProps } from "./performance-diagnosis-stat-row-props.type";

export function PerformanceDiagnosisStatRow(props: PerformanceDiagnosisStatRowProps) {
  const [decision, setDecision] = useState<PerformanceActionDecision | null>(null);

  const savePerformanceDecision = async (
    action: PerformanceActionDecision["action"],
  ): Promise<void> => {
    const nextDecision: PerformanceActionDecision = {
      action,
      code: props.stat.code,
      decidedAt: new Date()
        .toISOString(),
    };

    await props.onDecision(nextDecision);

    setDecision(nextDecision);
  };

  return (
    <UIContentGroup variant="tight">
      <PerformanceDiagnosisStatContent stat={props.stat} />
      <PerformanceDiagnosisStatActions onSelect={savePerformanceDecision} />
      {decision ? <PerformanceDecisionSaved decision={decision} /> : null}
    </UIContentGroup>
  );
}
