import { PriorKnowledgeStatus } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { createQuestionPriorKnowledgeRecord } from "./create-question-prior-knowledge-record.function";

describe("createQuestionPriorKnowledgeRecord", () => {
  it("preserves existing mastery while updating prior knowledge", () => {
    const result = createQuestionPriorKnowledgeRecord({
      existing: {
        contentKey: "topic:algebra",
        mastery: 0.7,
        reviewState: "review",
      },
      status: PriorKnowledgeStatus.Uncertain,
      timestamp: "2026-10-04T12:00:00.000Z",
    });

    expect(result).toEqual({
      contentKey: "topic:algebra",
      mastery: 0.7,
      priorKnowledge: PriorKnowledgeStatus.Uncertain,
      priorKnowledgeAt: "2026-10-04T12:00:00.000Z",
      reviewState: "review",
    });
  });
});
