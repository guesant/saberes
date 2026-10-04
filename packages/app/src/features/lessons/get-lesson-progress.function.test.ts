import { describe, expect, it } from "vitest";
import { getLessonBookmarked } from "./get-lesson-bookmarked.function";
import { getLessonCompleted } from "./get-lesson-completed.function";
import type { StudyRecord } from "@guesant/saberes-application";

describe("estado persistido da aula", () => {
  it("identifica conclusão pelo contentKey e pelo estado concluído", () => {
    const records: StudyRecord[] = [{ contentKey: "lesson:algebra-1", completed: true }];

    expect(getLessonCompleted({ records, contentKey: "lesson:algebra-1" }))
      .toBe(true);
  });

  it("identifica favoritos pelo contentKey", () => {
    const records: StudyRecord[] = [{ contentKey: "lesson:algebra-1" }];

    expect(getLessonBookmarked({ records, contentKey: "lesson:algebra-1" }))
      .toBe(true);
  });
});
