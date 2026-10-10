import { describe, expect, it } from "vitest";
import { getAssessmentPracticeQuestionKeys } from "./get-assessment-practice-question-keys.function";
import type { AssessmentDetailsReadModel } from "@guesant/saberes-application";

const baseAssessment: AssessmentDetailsReadModel = {
  id: 50,
  slug: "vu-2025-fase1-qz",
  title: "Unicamp 2025 — caderno QZ",
  description: "",
  kind: "exam",
  duration_minutes: 300,
  is_published: 1,
  expected_question_count: 72,
  canSimulate: true,
  canPractice: true,
  cancelledQuestionCount: 1,
  practiceQuestionKeys: ["question:1", "question:2", "question:3"],
  readinessReason: "",
};

describe("getAssessmentPracticeQuestionKeys", () => {
  it("uses only the eligible subset provided by the assessment read model", () => {
    expect(getAssessmentPracticeQuestionKeys(baseAssessment, ["question:1", "question:2", "question:3", "question:4"]))
      .toEqual(["question:1", "question:2", "question:3"]);
  });

  it("deduplicates question identities before creating a practice session", () => {
    expect(getAssessmentPracticeQuestionKeys({ ...baseAssessment, practiceQuestionKeys: ["question:1", "question:1"] }, []))
      .toEqual(["question:1"]);
  });

  it("does not create a practice session for a consultation-only assessment", () => {
    expect(getAssessmentPracticeQuestionKeys({ ...baseAssessment, canPractice: false }, ["question:1"]))
      .toEqual([]);
  });
});
