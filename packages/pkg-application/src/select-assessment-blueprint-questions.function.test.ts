import { describe, expect, it } from "vitest";
import { selectAssessmentBlueprintQuestions } from "./select-assessment-blueprint-questions.function";

describe("selectAssessmentBlueprintQuestions", () => {
  const base = {
    blueprintId: "unicamp-2027-first-practice",
    blueprintVersion: "1.2.0",
    stageKey: "unicamp-2027:first",
    expectedQuestionCount: 2,
    seed: "student-session-1",
  };

  it("assigns overlapping quotas without reusing a canonical question", () => {
    const result = selectAssessmentBlueprintQuestions({
      ...base,
      rules: [
        { id: "broad", questionCount: 1, subjectId: 1 },
        { id: "specific", questionCount: 1, subjectId: 1, skillId: 9 },
      ],
      candidates: [
        { questionKey: "question:old-1", canonicalQuestionId: 1, subjectIds: [1], skillIds: [9] },
        { questionKey: "question:new-1", canonicalQuestionId: 1, subjectIds: [1] },
        { questionKey: "question:old-2", canonicalQuestionId: 2, subjectIds: [1] },
      ],
    });

    expect(result.ready)
      .toBe(true);

    expect(result.assignments)
      .toHaveLength(2);

    expect(new Set(result.assignments.map((item) => {return item.canonicalQuestionId;})).size)
      .toBe(2);

    expect(result.insufficiencies)
      .toEqual([]);

    expect(result.assignments.find((item) => {return item.canonicalQuestionId === "1";})?.questionKey)
      .toBe("question:old-1");
  });

  it("returns per-rule deficits when the eligible pool is too small", () => {
    const result = selectAssessmentBlueprintQuestions({
      ...base,
      rules: [{ id: "math", questionCount: 2, subjectId: 2 }],
      candidates: [{ questionKey: "exercise:one", canonicalQuestionId: "one", subjectIds: [2] }],
    });

    expect(result.ready)
      .toBe(false);

    expect(result.insufficiencies)
      .toEqual([{ ruleId: "math", requested: 2, available: 1, missing: 1 }]);
  });

  it("reproduces the same composition for the same seed and changes it for another seed", () => {
    const candidates = Array.from({ length: 8 }, (_, index) => {return {
      questionKey: `exercise:${index}`,
      canonicalQuestionId: index,
      subjectIds: [1],
    };});

    const input = { ...base, rules: [{ id: "all", questionCount: 2, subjectId: 1 }], candidates };

    expect(selectAssessmentBlueprintQuestions(input).questionKeys)
      .toEqual(selectAssessmentBlueprintQuestions(input).questionKeys);

    expect(selectAssessmentBlueprintQuestions({ ...input, seed: "student-session-2" }).seed)
      .toBe("student-session-2");
  });
});
