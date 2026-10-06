import { getSimulationSessionProgress } from "@guesant/saberes-application";
import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationSessionNextButtonProps } from "./simulation-session-next-button-props.interface";

export function SimulationSessionNextButton(props: SimulationSessionNextButtonProps) {
  const { t } = useTranslation();

  const progress = getSimulationSessionProgress(props.viewModel.session);

  const currentIndex = progress.current - 1;

  const lastIndex = progress.total - 1;

  return (
    <UIButton disabled={currentIndex >= lastIndex || props.viewModel.busy} onClick={() => { return props.viewModel.navigate(currentIndex + 1); }}>
      {t("simulator.next")}
    </UIButton>
  );
}
