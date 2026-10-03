import type { ParseEditorialBlocksResult } from "@guesant/saberes-application";

export function getLessonSectionResultState(
  result?: ParseEditorialBlocksResult,
):
  | { status: "invalid"; message: string }
  | { status: "valid"; result: Extract<ParseEditorialBlocksResult, { status: "valid" }> } {
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
