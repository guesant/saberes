import { PedagogicalAction } from "@guesant/saberes-application";
import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";

export interface PerformanceDiagnosisStatActionsProps {
  onSelect(action: PerformanceActionDecision["action"]): Promise<void>;
}

export function PerformanceDiagnosisStatActions(props: PerformanceDiagnosisStatActionsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="inline">
      <UIButton
        onClick={() => props.onSelect(PedagogicalAction.Theory)}
        size="small"
        variant="text"
      >
        {t("performance.actions.theory")}
      </UIButton>
      <UIButton
        onClick={() => props.onSelect(PedagogicalAction.Practice)}
        size="small"
        variant="text"
      >
        {t("performance.actions.practice")}
      </UIButton>
      <UIButton onClick={() => props.onSelect("deferred")} size="small" variant="text">
        {t("performance.deferAction")}
      </UIButton>
      <UIButton onClick={() => props.onSelect("ignored")} size="small" variant="text">
        {t("performance.ignoreAction")}
      </UIButton>
    </UIContentGroup>
  );
}
