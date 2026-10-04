import type { PerformanceTopicStat } from "./performance-topic-stat.interface";
import type { UpdatePerformanceTopicStatInput } from "./update-performance-topic-stat-input.interface";

export function updatePerformanceTopicStat(
  input: UpdatePerformanceTopicStatInput,
): PerformanceTopicStat {
  const current = input.current || {
    topicId: input.topicId,
    attempts: 0,
    correct: 0,
    accuracy: 0,
    incorrect: 0,
  };

  const correct = Number(input.attempt.isCorrect === true);

  const incorrect = Number(input.attempt.isCorrect === false);

  const attempts = current.attempts + 1;

  const totalCorrect = current.correct + correct;

  return {
    topicId: input.topicId,
    attempts,
    correct: totalCorrect,
    accuracy: Math.round((totalCorrect / attempts) * 100),
    incorrect: current.incorrect + incorrect,
  };
}
