import type { SimulationSessionAnswerViewModel } from "./simulation-session-answer-view-model.interface";
import type { SimulationSessionCompletionViewModel } from "./simulation-session-completion-view-model.interface";
import type { SimulationSessionQueriesViewModel } from "./simulation-session-queries-view-model.interface";
import type { SimulationSessionUpdater } from "./simulation-session-updater.interface";

export interface CreateSimulationSessionViewModelInput {
  sessionId: string;
  query: SimulationSessionQueriesViewModel;
  remainingSeconds: number | null;
  updater: SimulationSessionUpdater;
  completion: SimulationSessionCompletionViewModel;
  answer: SimulationSessionAnswerViewModel;
}
