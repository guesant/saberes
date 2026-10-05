import type { CreateLessonProgressViewModelInput } from "./create-lesson-progress-view-model-input.interface";
import type { LessonProgressViewModel } from "./lesson-progress-view-model.interface";

export function createLessonProgressViewModel(
  input: CreateLessonProgressViewModelInput,
): LessonProgressViewModel {
  return {
    bookmarkActionError: input.actions.bookmark.error,
    bookmarkActionState: input.actions.bookmark.state,
    bookmarked: input.state.bookmarked,
    completed: input.state.completed,
    progressActionError: input.actions.progress.error,
    progressActionState: input.actions.progress.state,
    progressError: input.progress.progressError || input.progress.bookmarksError || null,
    sectionIndex: input.state.sectionIndex,
  };
}
