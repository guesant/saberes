import { updatePerformanceTopicStat } from "./update-performance-topic-stat.function";
import type { PerformanceTopicStat } from "./performance-topic-stat.interface";
import type { Attempt } from "@guesant/saberes-application";

export function getPerformanceTopicStats(attempts: Attempt[]): PerformanceTopicStat[] {
  const stats = new Map<string, PerformanceTopicStat>();

  for (const attempt of attempts) {
    for (const topicId of attempt.topicIds || []) {
      const key = String(topicId);

      stats.set(
        key,
        updatePerformanceTopicStat({
          attempt,
          current: stats.get(key),
          topicId: key,
        }),
      );
    }
  }

  return [...stats.values()].sort((left, right) => {
    return right.attempts - left.attempts;
  });
}
