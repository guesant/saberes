import type { QuestionBookmarkState } from "./question-bookmark-state.interface";
import type { QuestionViewModelActions } from "./question-view-model-actions.type";
import type { useQuestionContentQuery } from "./use-question-content-query.hook";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type CreateQuestionViewModelResultInput = {
  actions: QuestionViewModelActions;
  bookmark: QuestionBookmarkState;
  data: QuestionReadModel | null;
  query: ReturnType<typeof useQuestionContentQuery>;
};
