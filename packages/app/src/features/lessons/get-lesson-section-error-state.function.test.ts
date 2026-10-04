import { describe, expect, it, vi } from "vitest";
import { getLessonSectionErrorState } from "./get-lesson-section-error-state.function";

describe("getLessonSectionErrorState", () => {
  it("exposes a retry action for a failed editorial section", () => {
    const retry = vi.fn<() => Promise<void>>();

    const result = getLessonSectionErrorState({
      blocks: {
        data: undefined,
        error: new Error("blocks unavailable"),
        isError: true,
        isPending: false,
      },
      graph: {
        data: undefined,
        error: null,
        isError: false,
        isPending: false,
      },
      retry,
    });

    expect(result).toEqual({
      status: "error",
      error: new Error("blocks unavailable"),
      onRetry: retry,
    });
  });
});
