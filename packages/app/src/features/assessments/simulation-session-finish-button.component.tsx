import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationSessionFinishButtonProps } from "./simulation-session-finish-button-props.interface";

export function SimulationSessionFinishButton(props: SimulationSessionFinishButtonProps) {
  const { t } = useTranslation();

  return (
    <UIButton disabled={props.viewModel.busy} variant="contained" onClick={props.viewModel.requestFinish}>
      {t("simulator.finish")}
    </UIButton>
  );
}
