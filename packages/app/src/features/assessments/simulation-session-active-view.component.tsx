import { UIContentGroup } from "@guesant/saberes-ui";
import { SimulationAnswerSaveStatus } from "./simulation-answer-save-status.component";
import { SimulationFinishConfirmation } from "./simulation-finish-confirmation.component";
import { SimulationSessionAnswerPanel } from "./simulation-session-answer-panel.component";
import { SimulationSessionHeader } from "./simulation-session-header.component";
import { SimulationSessionNavigation } from "./simulation-session-navigation.component";
import type { SimulationSessionActiveViewProps } from "./simulation-session-active-view-props.interface";

export function SimulationSessionActiveView(props: SimulationSessionActiveViewProps) {
  return (
    <UIContentGroup variant="section">
      <SimulationSessionHeader viewModel={props.viewModel} />
      <SimulationAnswerSaveStatus viewModel={props.viewModel} />
      <SimulationSessionAnswerPanel question={props.question} viewModel={props.viewModel} />
      <SimulationSessionNavigation viewModel={props.viewModel} />
      <SimulationFinishConfirmation hidden={!props.viewModel.confirmed} viewModel={props.viewModel} />
    </UIContentGroup>
  );
}
