import type { SimulationSessionViewModel } from "./simulation-session-view-model.interface";
import type { QuestionReadModel } from "@guesant/saberes-application";

export interface SimulationSessionAnswerPanelProps {
  viewModel: SimulationSessionViewModel;
  question: QuestionReadModel;
}
