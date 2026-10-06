import { describe, expect, it } from "vitest";
import { getCourseItemHref } from "./get-course-item-href.function";

describe("getCourseItemHref", () => {
  it("opens lessons by their content slug", () => {
    expect(getCourseItemHref({ lesson_id: 1, lesson_slug: "functions-basics" }))
      .toBe("/licoes/functions-basics");
  });

  it("opens an assessment when a course item is an assessment", () => {
    expect(getCourseItemHref({ assessment_set_id: 7 }))
      .toBe("/avaliacoes/7");
  });

  it("opens an exercise by occurrence id", () => {
    expect(getCourseItemHref({ question_occurrence_id: 13 }))
      .toBe("/questoes/13");
  });
});
