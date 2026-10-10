export interface SimulationQuestionResult {
  questionKey: string;
  answer: string;
  expectedAnswer: string;
  isCorrect: boolean | null;
  answerStatus?: "cancelled";
  maxPoints: number;
  earnedPoints: number | null;
}
