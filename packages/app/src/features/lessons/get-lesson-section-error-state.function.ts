import type { LessonSectionContentQueries } from "./lesson-section-content-queries.interface";
import type { LessonSectionContentViewModel } from "./lesson-section-content.view-model";

export function getLessonSectionErrorState(
  queries: LessonSectionContentQueries,
): LessonSectionContentViewModel | undefined {
  if (queries.blocks.isError) {
    return { status: "error", error: queries.blocks.error };
  }

  if (queries.graph.isError) {
    return { status: "error", error: queries.graph.error };
  }

  return undefined;
}
