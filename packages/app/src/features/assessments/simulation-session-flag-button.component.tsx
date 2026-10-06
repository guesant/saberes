import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { SimulationSessionFlagButtonProps } from "./simulation-session-flag-button-props.interface";

export function SimulationSessionFlagButton(props: SimulationSessionFlagButtonProps) {
  const { t } = useTranslation();

  const isFlagged = props.viewModel.session?.flaggedQuestionKeys?.includes(props.viewModel.questionKey) || false;

  const label = String(t(isFlagged ? "simulator.flagged" : "simulator.flag"));

  return (
    <UIButton aria-pressed={isFlagged} disabled={props.viewModel.busy} variant="outlined" onClick={props.viewModel.toggleFlag}>
      {label}
    </UIButton>
  );
}
