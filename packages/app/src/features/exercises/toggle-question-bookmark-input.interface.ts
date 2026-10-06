import type { UseQuestionBookmarkInput } from "./use-question-bookmark-input.type";

export interface ToggleQuestionBookmarkInput extends UseQuestionBookmarkInput {
  bookmarked: boolean;
  contentKey: string;
}
