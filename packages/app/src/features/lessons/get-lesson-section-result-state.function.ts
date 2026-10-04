import type { LessonSectionContentInvalidState } from "./lesson-section-content-invalid-state.interface";
import type { LessonSectionContentValidState } from "./lesson-section-content-valid-state.interface";
import type { ParseEditorialBlocksResult } from "@guesant/saberes-application";

export function getLessonSectionResultState(
  result?: ParseEditorialBlocksResult,
): LessonSectionContentInvalidState | LessonSectionContentValidState {
  if (!result) {
    return { status: "invalid", message: "Editorial blocks are invalid." };
  }

  if (result.status === "invalid") {
    const firstIssue = result.issues[0];

    return {
      status: "invalid",
      message: firstIssue ? firstIssue.message : "Editorial blocks are invalid.",
    };
  }

  return { status: "valid", result };
}
