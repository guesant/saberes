import { describe, expect, it } from "vitest";
import { getCourseProgress } from "./get-course-progress.function";

describe("progresso do curso: lesson and question completion", () => {
  it("combina lições concluídas e questões tentadas", () => {
    const progress = getCourseProgress({
      attempts: [{ questionId: 22 }],
      items: [
        { lesson_id: 10, lesson_slug: "intro" },
        { question_occurrence_id: 22 },
        { lesson_id: 11, lesson_slug: "next" },
      ],
      lessonProgress: [{ contentKey: "lesson:intro", completed: true }],
    });

    expect(progress)
      .toEqual({
        completedItems: 2,
        percentage: 67,
        totalItems: 3,
      });
  });

  it("ignora itens sem referência estudável", () => {
    const progress = getCourseProgress({
      attempts: [],
      items: [{ item_type: "theory" }],
      lessonProgress: [],
    });

    expect(progress)
      .toEqual({
        completedItems: 0,
        percentage: 0,
        totalItems: 0,
      });
  });
});

describe("progresso do curso: canonical questions and saved assessment records", () => {
  it("recognizes attempts through the canonical question id", () => {
    const progress = getCourseProgress({
      attempts: [{ questionId: 900, canonicalQuestionId: 22 }],
      items: [{ question_id: 22 }],
      lessonProgress: [],
    });

    expect(progress.completedItems)
      .toBe(1);
  });

  it("recognizes an explicitly completed assessment record", () => {
    const progress = getCourseProgress({
      attempts: [],
      items: [{ assessment_set_id: 7 }],
      lessonProgress: [{ contentKey: "assessment:7", completed: true }],
    });

    expect(progress.completedItems)
      .toBe(1);
  });
});

describe("progresso do curso: assessment attempts", () => {
  it("completes an assessment only after every question occurrence was attempted", () => {
    const items = [
      { item_type: "question", question_occurrence_id: 90 },
      { item_type: "question", question_occurrence_id: 91 },
    ];

    const input = {
      attempts: [{ questionId: 90 }, { questionId: 91 }],
      items: [{ assessment_set_id: 7 }],
      lessonProgress: [],
      assessmentItemsById: { "7": items },
    };

    expect(getCourseProgress(input).completedItems)
      .toBe(1);

    expect(getCourseProgress({ ...input, attempts: [{ questionId: 90 }] }).completedItems)
      .toBe(0);
  });

  it("does not confuse occurrence ids with a canonical question id", () => {
    const progress = getCourseProgress({
      attempts: [{ questionId: 22 }],
      items: [{ question_id: 22 }],
      lessonProgress: [],
    });

    expect(progress.completedItems)
      .toBe(0);
  });
});
