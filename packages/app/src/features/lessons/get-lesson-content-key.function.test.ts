import { describe, expect, it } from "vitest";
import { getLessonContentKey } from "./get-lesson-content-key.function";

describe("getLessonContentKey", () => {
  it("keeps a published lesson slug stable", () => {
    expect(
      getLessonContentKey({
        lesson: { slug: "functions" },
        fallback: "lesson:42",
      }),
    )
      .toBe("lesson:functions");
  });

  it("does not duplicate the lesson prefix in a route fallback", () => {
    expect(getLessonContentKey({ lesson: undefined, fallback: "lesson:42" }))
      .toBe("lesson:42");
  });
});
