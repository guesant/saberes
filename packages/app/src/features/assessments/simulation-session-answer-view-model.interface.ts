export interface SimulationSessionAnswerViewModel {
  answer: string;
  changeAnswer(value: string): Promise<void>;
}
