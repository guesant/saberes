import type { SimulationAnswerChoice } from "./simulation-answer-choice.interface";

export interface UISimulationAnswerInputProps {
  questionType: string;
  options: SimulationAnswerChoice[];
  value: string;
  disabled: boolean;
  onChange(value: string): void;
}
