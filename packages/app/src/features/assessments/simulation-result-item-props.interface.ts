import type { SimulationQuestionResult } from "@guesant/saberes-application";

export interface SimulationResultItemProps {
  ordinal: number;
  total: number;
  result: SimulationQuestionResult;
}
