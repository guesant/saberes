import { getLessonProgressState } from "./get-lesson-progress-state.function";
import { useLessonProgressQueries } from "./use-lesson-progress-queries.hook";
import type { LessonActionsState } from "./lesson-actions-state.interface";

export interface CreateLessonProgressViewModelInput {
  actions: LessonActionsState;
  progress: ReturnType<typeof useLessonProgressQueries>;
  state: ReturnType<typeof getLessonProgressState>;
}
