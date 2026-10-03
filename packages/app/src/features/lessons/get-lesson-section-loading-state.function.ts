import type { LessonSectionContentQueries } from "./lesson-section-content-queries.interface";
import type { LessonSectionContentViewModel } from "./lesson-section-content.view-model";

export function getLessonSectionLoadingState(
  queries: LessonSectionContentQueries,
): LessonSectionContentViewModel | undefined {
  if (queries.blocks.isPending || queries.graph.isPending) {
    return { status: "loading" };
  }

  return undefined;
}
