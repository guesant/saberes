import { describe, expect, it } from "vitest";
import { getStudyPathNavigation } from "./get-study-path-navigation.function";

const items = [
  { id: 1, lesson_id: 5, lesson_slug: "conceito", title: "Conceito" },
  { id: 2, question_occurrence_id: 7, title: "Prática" },
  { id: 3, lesson_id: 6, lesson_slug: "revisao", title: "Revisão" },
];

describe("getStudyPathNavigation", () => {
  it("connects steps while preserving the course context", () => {
    expect(getStudyPathNavigation(items, "preparacao", { stepId: "2", pathname: "/questoes/7" }))
      .toEqual({
        title: "Prática",
        position: 2,
        total: 3,
        previous: "/licoes/conceito?course=preparacao&step=1",
        next: "/licoes/revisao?course=preparacao&step=3",
        roadmap: "/cursos/preparacao",
      });
  });

  it("does not restart the path at its end", () => {
    expect(getStudyPathNavigation(items, "preparacao", { stepId: "3", pathname: "/licoes/revisao" })?.next)
      .toBeNull();

    expect(
      getStudyPathNavigation(items, "preparacao", { stepId: "1", pathname: "/licoes/conceito" })?.previous,
    )
      .toBeNull();
  });

  it("ignores absent, unknown, or mismatched context", () => {
    expect(getStudyPathNavigation(items, "preparacao", { stepId: null, pathname: "/questoes/7" }))
      .toBeNull();

    expect(getStudyPathNavigation(items, "preparacao", { stepId: "99", pathname: "/questoes/7" }))
      .toBeNull();

    expect(getStudyPathNavigation(items, "preparacao", { stepId: "1", pathname: "/questoes/7" }))
      .toBeNull();
  });
});
