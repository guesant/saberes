import type { ScoreSimulationQuestionInput } from "./score-simulation-question-input.interface";
import type { SimulationQuestionResult } from "./simulation-question-result.interface";

export interface CreateSimulationAttemptInput extends ScoreSimulationQuestionInput {
  result: SimulationQuestionResult;
  completedAt: string;
}
