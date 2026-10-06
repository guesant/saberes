import { UIContentGroup, UIListItem, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getSimulationAnswerStatus } from "./get-simulation-answer-status.function";
import type { SimulationResultItemProps } from "./simulation-result-item-props.interface";

export function SimulationResultItem(props: SimulationResultItemProps) {
  const { t } = useTranslation();

  const answerStatus = getSimulationAnswerStatus(props.result.isCorrect, t);

  const earned = props.result.earnedPoints ?? "—";

  return (
    <UIListItem disableGutters>
      <UIContentGroup variant="content">
        <UITypography variant="h3">{t("simulator.questionPosition", { current: props.ordinal, total: props.total })}</UITypography>
        <UITypography>{answerStatus}</UITypography>
        <UITypography>{t("simulator.score", { earned, maximum: props.result.maxPoints })}</UITypography>
      </UIContentGroup>
    </UIListItem>
  );
}
