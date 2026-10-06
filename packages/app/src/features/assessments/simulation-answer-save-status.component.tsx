import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationAnswerSaveStatusProps } from "./simulation-answer-save-status-props.interface";

export function SimulationAnswerSaveStatus(props: SimulationAnswerSaveStatusProps) {
  const { t } = useTranslation();

  let status = t("simulator.emptyAnswer");

  if (props.viewModel.busy) {
    status = t("simulator.savingAnswer");
  }

  if (!props.viewModel.busy && props.viewModel.answer.trim()) {
    status = t("simulator.savedAnswer");
  }

  return <UITypography aria-live="polite">{status}</UITypography>;
}
