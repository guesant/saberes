import { UIInlineActions } from "@guesant/saberes-ui";
import { SimulationSessionFinishButton } from "./simulation-session-finish-button.component";
import { SimulationSessionFlagButton } from "./simulation-session-flag-button.component";
import { SimulationSessionNextButton } from "./simulation-session-next-button.component";
import { SimulationSessionPreviousButton } from "./simulation-session-previous-button.component";
import type { SimulationSessionNavigationProps } from "./simulation-session-navigation-props.interface";

export function SimulationSessionNavigation(props: SimulationSessionNavigationProps) {
  return (
    <UIInlineActions wrap>
      <SimulationSessionPreviousButton viewModel={props.viewModel} />
      <SimulationSessionFlagButton viewModel={props.viewModel} />
      <SimulationSessionNextButton viewModel={props.viewModel} />
      <SimulationSessionFinishButton viewModel={props.viewModel} />
    </UIInlineActions>
  );
}
