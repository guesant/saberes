import "fake-indexeddb/auto";
import { ProgressDatabase } from "@guesant/saberes-adapter-data-v1/progress";
import { afterEach, describe, expect, it } from "vitest";
import { getCourseProgress } from "../features/courses/get-course-progress.function";
import { getNextCourseItemHref } from "../features/courses/get-next-course-item-href.function";

const databaseName = "study-path-persistence-test";

const items = [
  { id: 1, lesson_id: 1, lesson_slug: "concept" },
  { id: 2, question_occurrence_id: 342 },
  { id: 3, question_occurrence_id: 342 },
  { id: 4, lesson_id: 2, lesson_slug: "review" },
];

afterEach(async () => {
  const db = new ProgressDatabase(databaseName);

  await db.delete();
});

describe("study path persistent progress", () => {
  it("resumes after reopen and completes a shared occurrence without a duplicate attempt", async () => {
    const db = new ProgressDatabase(databaseName);

    await db.saveLessonProgress("lesson:concept", { completed: true });

    await db.saveAttempt({ questionId: 342, canonicalQuestionId: 342, answer: "B", isCorrect: true });

    db.close();

    const reopened = new ProgressDatabase(databaseName);

    const input = { items, attempts: await reopened.listAttempts(), lessonProgress: await reopened.listLessonProgress() };

    expect(getCourseProgress(input).completedItems)
      .toBe(3);

    expect(getNextCourseItemHref({ ...input, courseSlug: "preparation" }))
      .toBe("/licoes/review?course=preparation&step=4");

    expect(input.attempts)
      .toHaveLength(1);

    reopened.close();
  });
});
