import { PedagogicalAction } from "@guesant/saberes-application";
import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PerformanceActionDecision } from "./performance-action-decision.interface";

export interface PerformanceDiagnosisStatActionsProps {
  onSelect(action: PerformanceActionDecision["action"]): Promise<void>;
}

export function PerformanceDiagnosisStatActions(props: PerformanceDiagnosisStatActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <UIButton
        onClick={() => { return props.onSelect(PedagogicalAction.Theory); }}
        size="small"
        variant="text"
      >
        {t("performance.actions.theory")}
      </UIButton>
      <UIButton
        onClick={() => { return props.onSelect(PedagogicalAction.Practice); }}
        size="small"
        variant="text"
      >
        {t("performance.actions.practice")}
      </UIButton>
      <UIButton
        onClick={() => { return props.onSelect("deferred"); }}
        size="small"
        variant="text"
      >
        {t("performance.deferAction")}
      </UIButton>
      <UIButton
        onClick={() => { return props.onSelect("ignored"); }}
        size="small"
        variant="text"
      >
        {t("performance.ignoreAction")}
      </UIButton>
    </UIInlineActions>
  );
}
