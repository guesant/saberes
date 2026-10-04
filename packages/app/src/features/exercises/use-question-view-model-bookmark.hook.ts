import { useQuestionBookmark } from "./use-question-bookmark.hook";
import type { QuestionBookmarkState } from "./question-bookmark-state.interface";
import type { UseQuestionBookmarkInput } from "./use-question-bookmark-input.type";

export function useQuestionViewModelBookmark(
  input: UseQuestionBookmarkInput,
): QuestionBookmarkState {
  return useQuestionBookmark(input);
}
