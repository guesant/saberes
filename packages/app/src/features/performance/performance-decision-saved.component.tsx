import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";

export interface PerformanceDecisionSavedProps {
  decision: PerformanceActionDecision;
}

export function PerformanceDecisionSaved(props: PerformanceDecisionSavedProps) {
  const { t } = useTranslation();

  return (
    <UITypography color="text.secondary" variant="body2">
      {t(`performance.decisionSaved.${props.decision.action}`)}
    </UITypography>
  );
}
