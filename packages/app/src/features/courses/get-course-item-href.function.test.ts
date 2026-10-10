import { describe, expect, it } from "vitest";
import { getCourseItemHref } from "./get-course-item-href.function";

describe("getCourseItemHref: course lessons and navigation context", () => {
  it("opens lessons by their content slug", () => {
    expect(
      getCourseItemHref({
        lesson_id: 1,
        lesson_slug: "functions-basics",
      }),
    )
      .toBe("/licoes/functions-basics");
  });

  it("attaches course and step context to roadmap destinations", () => {
    expect(
      getCourseItemHref(
        { id: 41, lesson_id: 1, lesson_slug: "functions-basics" },
        "unicamp-2027-primeira-fase",
      ),
    )
      .toBe("/licoes/functions-basics?course=unicamp-2027-primeira-fase&step=41");
  });
});

describe("getCourseItemHref: assessment and question destinations", () => {
  it("opens an assessment when a course item is an assessment", () => {
    expect(getCourseItemHref({ assessment_set_id: 7 }))
      .toBe("/avaliacoes/7");
  });

  it("opens an exercise by occurrence id", () => {
    expect(getCourseItemHref({ question_occurrence_id: 13 }))
      .toBe("/questoes/13");
  });

  it("does not confuse canonical and occurrence identifiers", () => {
    expect(getCourseItemHref({ question_id: 5, question_occurrence_id: 13 }))
      .toBe("/questoes/13");

    expect(getCourseItemHref({ question_id: 5, question_slug: "algebra" }))
      .toBe("/exercicios/algebra");

    expect(getCourseItemHref({ question_id: 5 }))
      .toBeNull();
  });
});

describe("getCourseItemHref: practice and review destinations", () => {
  it("opens practice activities with their question association", () => {
    expect(
      getCourseItemHref({
        item_type: "practice",
        question_occurrence_id: 13,
      }),
    )
      .toBe("/questoes/13");
  });

  it("opens course review activities in the review flow", () => {
    expect(
      getCourseItemHref({
        item_type: "review",
        question_occurrence_id: 13,
      }),
    )
      .toBe("/revisoes");
  });

  it("keeps a practice action usable when no question association is present", () => {
    expect(getCourseItemHref({ item_type: "practice" }))
      .toBe("/catalogo?modo=praticar");
  });

  it("preserves existing query parameters when adding course context", () => {
    expect(getCourseItemHref({ id: "practice-1", item_type: "practice" }, "course slug"))
      .toBe(
        "/catalogo?modo=praticar&course=course+slug&step=practice-1",
      );
  });
});
