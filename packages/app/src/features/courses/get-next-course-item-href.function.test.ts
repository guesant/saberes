import { describe, expect, it } from "vitest";
import { getNextCourseItemHref } from "./get-next-course-item-href.function";

describe("getNextCourseItemHref", () => {
  it("skips completed lessons and opens the next activity", () => {
    expect(getNextCourseItemHref({
      attempts: [],
      items: [
        { id: 1, item_type: "lesson", lesson_id: 1, lesson_slug: "first" },
        { id: 2, item_type: "lesson", lesson_id: 2, lesson_slug: "second" },
      ],
      lessonProgress: [{ contentKey: "lesson:first", completed: true }],
    }))
      .toBe("/licoes/second");
  });

  it("reopens the first item when all items are complete", () => {
    expect(getNextCourseItemHref({
      attempts: [],
      items: [{ id: 1, item_type: "lesson", lesson_id: 1, lesson_slug: "first" }],
      lessonProgress: [{ contentKey: "lesson:first", completed: true }],
    }))
      .toBe("/licoes/first");
  });

  it("returns null when the course has no navigable activities", () => {
    expect(getNextCourseItemHref({ attempts: [], items: [], lessonProgress: [] }))
      .toBeNull();
  });
});
