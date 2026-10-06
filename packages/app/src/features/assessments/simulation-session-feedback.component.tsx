import { UIAlert } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationSessionFeedbackProps } from "./simulation-session-feedback-props.interface";

export function SimulationSessionFeedback(props: SimulationSessionFeedbackProps) {
  const { t } = useTranslation();

  return (
    <>
      <UIAlert hidden={!props.viewModel.error} severity="error">{props.viewModel.error || ""}</UIAlert>
      <UIAlert hidden={!props.viewModel.expired} severity="warning">{t("simulator.expired")}</UIAlert>
    </>
  );
}
