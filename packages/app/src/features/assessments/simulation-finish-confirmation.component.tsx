import { UIAlert, UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationFinishConfirmationProps } from "./simulation-finish-confirmation-props.interface";

export function SimulationFinishConfirmation(props: SimulationFinishConfirmationProps) {
  const { t } = useTranslation();

  return (
    <UIAlert hidden={props.hidden} severity="warning">
      <UIContentGroup variant="content">
        <UITypography>{t("simulator.confirmFinish")}</UITypography>
        <UIInlineActions wrap>
          <UIButton disabled={props.viewModel.finishing} onClick={props.viewModel.cancelFinish}>{t("simulator.keepSolving")}</UIButton>
          <UIButton disabled={props.viewModel.finishing} variant="contained" onClick={props.viewModel.finish}>{t("simulator.finishNow")}</UIButton>
        </UIInlineActions>
      </UIContentGroup>
    </UIAlert>
  );
}
