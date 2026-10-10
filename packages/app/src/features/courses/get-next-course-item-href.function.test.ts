import { describe, expect, it } from "vitest";
import { getNextCourseItemHref } from "./get-next-course-item-href.function";

describe("getNextCourseItemHref: skips completed lessons", () => {
  it("skips completed lessons and opens the next activity", () => {
    expect(
      getNextCourseItemHref({
        attempts: [],
        items: [
          {
            id: 1,
            item_type: "lesson",
            lesson_id: 1,
            lesson_slug: "first",
          },
          {
            id: 2,
            item_type: "lesson",
            lesson_id: 2,
            lesson_slug: "second",
          },
        ],
        lessonProgress: [{ contentKey: "lesson:first", completed: true }],
      }),
    )
      .toBe("/licoes/second");
  });

});

describe("getNextCourseItemHref: resume context", () => {
  it("keeps course and step context when resuming at the next item", () => {
    expect(
      getNextCourseItemHref({
        attempts: [],
        courseSlug: "unicamp-2027-primeira-fase",
        items: [
          {
            id: 3,
            item_type: "lesson",
            lesson_id: 1,
            lesson_slug: "first",
          },
          {
            id: 4,
            item_type: "lesson",
            lesson_id: 2,
            lesson_slug: "second",
          },
        ],
        lessonProgress: [{ contentKey: "lesson:first", completed: true }],
      }),
    )
      .toBe("/licoes/second?course=unicamp-2027-primeira-fase&step=4");
  });
});

describe("getNextCourseItemHref: course end states", () => {
  it("returns no destination when all items are complete", () => {
    expect(
      getNextCourseItemHref({
        attempts: [],
        items: [
          {
            id: 1,
            item_type: "lesson",
            lesson_id: 1,
            lesson_slug: "first",
          },
        ],
        lessonProgress: [{ contentKey: "lesson:first", completed: true }],
      }),
    )
      .toBeNull();
  });

  it("returns null when the course has no navigable activities", () => {
    expect(
      getNextCourseItemHref({
        attempts: [],
        items: [],
        lessonProgress: [],
      }),
    )
      .toBeNull();
  });
});
