import { describe, expect, it, vi } from "vitest";
import { getLessonSectionErrorState } from "./get-lesson-section-error-state.function";
import type { LessonSectionContentQueryState } from "./lesson-section-content-query-state.interface";

const retry = vi.fn();

const failedBlocks = {
  data: undefined,
  error: new Error("blocks unavailable"),
  isError: true,
  isPending: false,
};

const failedGraph = {
  data: undefined,
  error: new Error("graph unavailable"),
  isError: true,
  isPending: false,
};

const validBlocks: LessonSectionContentQueryState = {
  data: { blocks: [], status: "valid" },
  error: null,
  isError: false,
  isPending: false,
};

const validGraph = {
  data: undefined,
  error: null,
  isError: false,
  isPending: false,
};

describe("getLessonSectionErrorState", () => {
  it("exposes a retry action for a failed editorial section", () => {
    retry.mockClear();

    const result = getLessonSectionErrorState({
      blocks: failedBlocks,
      graph: validGraph,
      retry,
    });

    expect(result).toEqual({
      status: "error",
      error: new Error("blocks unavailable"),
      onRetry: retry,
    });
  });

  it("isolates a graph failure from the rest of the lesson", () => {
    retry.mockClear();

    const result = getLessonSectionErrorState({
      blocks: validBlocks,
      graph: failedGraph,
      retry,
    });

    expect(result?.status).toBe("error");

    if (result?.status === "error") {
      expect(result.error).toEqual(new Error("graph unavailable"));

      expect(result.onRetry).toBe(retry);
    }
  });
});
