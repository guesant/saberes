import { describe, expect, it } from "vitest";
import { getPerformanceTopicStats } from "./get-performance-topic-stats.function";

describe("getPerformanceTopicStats", () => {
  it("agrega tentativas por tópico e ordena por volume", () => {
    const result = getPerformanceTopicStats([
      { isCorrect: true, topicIds: ["topic-a", "topic-b"] },
      { isCorrect: false, topicIds: ["topic-a"] },
      { isCorrect: true, topicIds: ["topic-a"] },
    ]);

    expect(result).toEqual([
      { accuracy: 67, attempts: 3, correct: 2, incorrect: 1, topicId: "topic-a" },
      { accuracy: 100, attempts: 1, correct: 1, incorrect: 0, topicId: "topic-b" },
    ]);
  });
});
