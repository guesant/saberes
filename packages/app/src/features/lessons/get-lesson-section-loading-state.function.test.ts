import { describe, expect, it } from "vitest";
import { getLessonSectionLoadingState } from "./get-lesson-section-loading-state.function";
import type { LessonSectionContentQueries } from "./lesson-section-content-queries.interface";

const readyBlocks = {
  data: undefined,
  error: null,
  isError: false,
  isPending: false,
};

const readyGraph = {
  data: undefined,
  error: null,
  isEnabled: false,
  isError: false,
  isPending: true,
};

export function createQueries(
  graph: Partial<typeof readyGraph> = {},
  blocks: Partial<typeof readyBlocks> = {},
): LessonSectionContentQueries {
  return {
    blocks: { ...readyBlocks, ...blocks },
    graph: { ...readyGraph, ...graph },
    retry: async (): Promise<void> => {},
  };
}

describe("getLessonSectionLoadingState", () => {
  it("does not keep a section loading when its graph query is disabled", () => {
    expect(getLessonSectionLoadingState(createQueries()))
      .toBeUndefined();
  });

  it("keeps a section loading while an enabled graph query is pending", () => {
    expect(getLessonSectionLoadingState(createQueries({ isEnabled: true })))
      .toEqual({ status: "loading" });
  });

  it("keeps a section loading while editorial blocks are pending", () => {
    expect(getLessonSectionLoadingState(createQueries({}, { isPending: true })))
      .toEqual({ status: "loading" });
  });
});
