import { describe, expect, it } from "vitest";
import { getLessonSectionIndex } from "./get-lesson-section-index.function";

describe("getLessonSectionIndex", () => {
  it("returns the saved section index for the lesson", () => {
    expect(
      getLessonSectionIndex({
        contentKey: "lesson:functions",
        records: [{ contentKey: "lesson:functions", sectionIndex: 2 }],
      }),
    ).toBe(2);
  });

  it("ignores missing or invalid section indexes", () => {
    expect(
      getLessonSectionIndex({
        contentKey: "lesson:functions",
        records: [{ contentKey: "lesson:functions", sectionIndex: -1 }],
      }),
    ).toBeUndefined();
  });
});
