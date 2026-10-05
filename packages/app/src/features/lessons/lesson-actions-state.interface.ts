import type { LessonBookmarkActionState } from "./lesson-bookmark-action-state.interface";
import type { LessonProgressActionState } from "./lesson-progress-action-state.interface";

export interface LessonActionsState {
  bookmark: LessonBookmarkActionState;
  progress: LessonProgressActionState;
  saveSection(sectionIndex: number): Promise<void>;
}
