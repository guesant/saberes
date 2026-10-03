import { createLessonSectionContentViewModel } from "./create-lesson-section-content-view-model.function";
import { useLessonSectionContentQueries } from "./use-lesson-section-content-queries.hook";
import type { LessonSectionContentInput } from "./lesson-section-content-input.type";
import type { LessonSectionContentViewModel } from "./lesson-section-content.view-model";

export function useLessonSectionContentViewModel(
  props: LessonSectionContentInput,
): LessonSectionContentViewModel {
  const queries = useLessonSectionContentQueries(props);

  return createLessonSectionContentViewModel(props, queries);
}
