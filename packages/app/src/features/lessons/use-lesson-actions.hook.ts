import { createLessonProgressActions } from "./create-lesson-progress-actions.function";
import { useLessonBookmarkAction } from "./use-lesson-bookmark-action.hook";
import { useLessonProgressAction } from "./use-lesson-progress-action.hook";
import type { LessonActionsState } from "./lesson-actions-state.interface";
import type { UseLessonActionsInput } from "./use-lesson-actions-input.type";

export function useLessonActions(input: UseLessonActionsInput): LessonActionsState {
  const actions = createLessonProgressActions(input);

  const progress = useLessonProgressAction({ action: actions.saveProgress });

  const bookmark = useLessonBookmarkAction({ action: actions.saveBookmark });

  return { bookmark, progress, saveSection: actions.saveSection };
}
