import { describe, expect, it } from "vitest";
import { getLessonPracticeHref } from "./get-lesson-practice-href.function";

describe("getLessonPracticeHref", () => {
  it("opens practice for a topic associated with the lesson", () => {
    expect(getLessonPracticeHref([{
      description: null,
      id: 4,
      slug: "funcoes-graficos",
      title: "Funções e gráficos",
    }]))
      .toBe("/topicos/funcoes-graficos#pratica");
  });

  it("does not send an unlinked lesson to generic practice", () => {
    expect(getLessonPracticeHref([]))
      .toBeNull();
  });
});
