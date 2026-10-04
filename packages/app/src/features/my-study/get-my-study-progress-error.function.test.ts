import { describe, expect, it } from "vitest";
import { getMyStudyProgressError } from "./get-my-study-progress-error.function";
import type { GetMyStudyProgressErrorInput } from "./get-my-study-progress-error.function";

const emptyErrors: GetMyStudyProgressErrorInput = {
  achievementsError: null,
  attemptsError: null,
  bookmarksError: null,
  reviewsError: null,
  sessionsError: null,
  streakError: null,
  topicMasteryError: null,
};

describe("getMyStudyProgressError", () => {
  it("returns only the first isolated progress error", () => {
    const attemptsError = new Error("attempts unavailable");

    const result = getMyStudyProgressError({
      ...emptyErrors,
      attemptsError,
      bookmarksError: new Error("bookmarks unavailable"),
    });

    expect(result)
      .toBe(attemptsError);
  });

  it("keeps the study view healthy when every progress query succeeds", () => {
    expect(getMyStudyProgressError(emptyErrors))
      .toBeNull();
  });
});
