import { createLessonSectionReadyViewModel } from "./create-lesson-section-ready-view-model.function";
import { getLessonSectionErrorState } from "./get-lesson-section-error-state.function";
import { getLessonSectionLoadingState } from "./get-lesson-section-loading-state.function";
import { getLessonSectionResultState } from "./get-lesson-section-result-state.function";
import type { LessonSectionContentInput } from "./lesson-section-content-input.type";
import type { LessonSectionContentQueries } from "./lesson-section-content-queries.interface";
import type { LessonSectionContentViewModel } from "./lesson-section-content.view-model";

export function createLessonSectionContentViewModel(
  input: LessonSectionContentInput,
  queries: LessonSectionContentQueries,
): LessonSectionContentViewModel {
  const loadingState = getLessonSectionLoadingState(queries);

  if (loadingState) {
    return loadingState;
  }

  const errorState = getLessonSectionErrorState(queries);

  if (errorState) {
    return errorState;
  }

  const resultState = getLessonSectionResultState(queries.blocks.data);

  if (resultState.status === "invalid") {
    return resultState;
  }

  return createLessonSectionReadyViewModel(input, resultState.result.blocks, queries.graph.data);
}
