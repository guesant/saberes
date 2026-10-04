import { describe, expect, it } from "vitest";
import { getCourseProgress } from "./get-course-progress.function";

describe("progresso do curso", () => {
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

    expect(progress).toEqual({ completedItems: 2, percentage: 67, totalItems: 3 });
  });

  it("ignora itens sem referência estudável", () => {
    const progress = getCourseProgress({
      attempts: [],
      items: [{ item_type: "theory" }],
      lessonProgress: [],
    });

    expect(progress).toEqual({ completedItems: 0, percentage: 0, totalItems: 0 });
  });
});
