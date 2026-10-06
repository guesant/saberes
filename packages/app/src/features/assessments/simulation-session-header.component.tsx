import { getSimulationSessionProgress } from "@guesant/saberes-application";
import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { formatSimulationTime } from "./format-simulation-time.function";
import { SimulationSessionFeedback } from "./simulation-session-feedback.component";
import type { SimulationSessionHeaderProps } from "./simulation-session-header-props.interface";

export function SimulationSessionHeader(props: SimulationSessionHeaderProps) {
  const { t } = useTranslation();

  const progress = getSimulationSessionProgress(props.viewModel.session);

  const time = formatSimulationTime(props.viewModel.remainingSeconds);

  return (
    <UIContentGroup variant="content">
      <UITypography variant="overline">{t("simulator.eyebrow")}</UITypography>
      <UITypography variant="h1">{t("simulator.title")}</UITypography>
      <UITypography aria-live="polite" aria-atomic="true">{t("simulator.questionPosition", { current: progress.current, total: progress.total })} · {time}</UITypography>
      <SimulationSessionFeedback viewModel={props.viewModel} />
    </UIContentGroup>
  );
}
