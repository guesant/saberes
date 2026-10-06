import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationSessionPreviousButtonProps } from "./simulation-session-previous-button-props.interface";

export function SimulationSessionPreviousButton(props: SimulationSessionPreviousButtonProps) {
  const { t } = useTranslation();

  const currentIndex = props.viewModel.session?.currentIndex || 0;

  return (
    <UIButton disabled={currentIndex === 0 || props.viewModel.busy} onClick={() => { return props.viewModel.navigate(currentIndex - 1); }}>
      {t("simulator.previous")}
    </UIButton>
  );
}
