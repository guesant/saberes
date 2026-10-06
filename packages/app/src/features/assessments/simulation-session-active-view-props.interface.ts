import type { SimulationSessionViewModel } from "./simulation-session-view-model.interface";
import type { QuestionReadModel } from "@guesant/saberes-application";

export interface SimulationSessionActiveViewProps {
  viewModel: SimulationSessionViewModel;
  question: QuestionReadModel;
}
