import { CatalogCardType } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getMyStudySavedLessons } from "./get-my-study-saved-lessons.function";

describe("getMyStudySavedLessons", () => {
  it("returns published lesson cards referenced by local bookmarks", () => {
    const lessons = getMyStudySavedLessons({
      content: [
        { id: 1, slug: "functions", title: "Funções", type: CatalogCardType.Lesson },
        { id: 2, slug: "sets", title: "Conjuntos", type: CatalogCardType.Lesson },
        { id: 3, slug: "guide", title: "Guia", type: CatalogCardType.Resource },
      ],
      bookmarks: [{ contentKey: "lesson:functions" }],
    });

    expect(lessons).toHaveLength(1);

    expect(lessons[0]?.slug).toBe("functions");
  });

  it("returns an empty list when there are no local bookmarks", () => {
    expect(
      getMyStudySavedLessons({
        content: [{ id: 1, slug: "functions", title: "Funções", type: CatalogCardType.Lesson }],
        bookmarks: undefined,
      }),
    ).toEqual([]);
  });
});
