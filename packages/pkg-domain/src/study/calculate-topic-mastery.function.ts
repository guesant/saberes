import { calculateDiagnosticWeight } from "./calculate-diagnostic-weight.function.ts";
import type { AttemptRecord } from "../index.ts";

export function calculateTopicMastery(attempts: AttemptRecord[] = []) {
  const map = new Map<
    string,
    {
      total: number;
      correct: number;
      weighted: number;
      lastAnsweredAt: string | null;
    }
  >();

  attempts.forEach((attempt) => {
    if (attempt.isCorrect === null || attempt.isCorrect === undefined) {
      return;
    }

    (attempt.topicIds || []).forEach((rawTopicId) => {
      const topicId = String(rawTopicId);

      const value = map.get(topicId) || {
        total: 0,
        correct: 0,
        weighted: 0,
        lastAnsweredAt: null,
      };

      const weight = calculateDiagnosticWeight(attempt.diagnosis);

      value.total += 1;

      value.correct += attempt.isCorrect ? 1 : 0;

      value.weighted += attempt.isCorrect ? weight : 0;

      value.lastAnsweredAt = attempt.answeredAt || value.lastAnsweredAt;

      map.set(topicId, value);
    });
  });

  return Object.fromEntries(
    [...map.entries()].map(([topicId, value]) => {
      const percentage = value.total ? Math.round((value.correct / value.total) * 100) : 0;

      const weightedPercentage = value.total ? Math.round((value.weighted / value.total) * 100) : 0;

      let confidence = "high";

      if (value.total < 3) {
        confidence = "low";
      } else if (value.total < 8) {
        confidence = "medium";
      }

      let learningState = "unseen";

      if (value.total) {
        learningState = "practicing";
      }

      if (percentage >= 80 && value.total >= 5) {
        learningState = "mastered";
      }

      return [
        topicId,
        {
          ...value,
          percentage,
          weightedPercentage,
          confidence,
          learningState,
        },
      ];
    }),
  );
}
