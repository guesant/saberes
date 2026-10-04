export interface TopicMasteryAccumulator {
  total: number;
  correct: number;
  weighted: number;
  lastAnsweredAt: string | null;
}
