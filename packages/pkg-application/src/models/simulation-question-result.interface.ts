export interface SimulationQuestionResult {
  questionKey: string;
  answer: string;
  expectedAnswer: string;
  isCorrect: boolean | null;
  maxPoints: number;
  earnedPoints: number | null;
}
