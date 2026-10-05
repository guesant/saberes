import type { ActionState } from "../../types/action-state.type";
import type { LessonReadModel } from "@guesant/saberes-application";

export interface LessonReadyHeaderProps {
  bookmarked: boolean;
  bookmarkActionState: ActionState;
  completed: boolean;
  onBookmark(): Promise<void>;

  onComplete(value: boolean): Promise<void>;
  data: LessonReadModel;
  progressActionState: ActionState;
}
