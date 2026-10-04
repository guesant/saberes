import type { LessonSectionContentQueryState } from "./lesson-section-content-query-state.interface";
import type { LessonSectionGraphQueryState } from "./lesson-section-graph-query-state.interface";

export interface LessonSectionContentQueries {
  blocks: LessonSectionContentQueryState;
  graph: LessonSectionGraphQueryState;
  retry(): Promise<void>;
}
