import type { SimulationAnswerChoice } from "./simulation-answer-choice.interface";

export interface UISimulationAnswerOptionProps {
  option: SimulationAnswerChoice;
  selected: boolean;
  disabled: boolean;
  onSelect(value: string): void;
}
