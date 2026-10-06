import type { Attempt } from "./attempt.type";
import type { SimulationQuestionResult } from "./simulation-question-result.interface";

export interface PreparedSimulationCompletion {
  attempts: Attempt[];
  results: SimulationQuestionResult[];
}
