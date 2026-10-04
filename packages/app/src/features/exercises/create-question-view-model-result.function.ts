import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import type { CreateQuestionViewModelResultInput } from "./create-question-view-model-result-input.type";
import type { QuestionViewModel } from "./question.view-model";

export function createQuestionViewModelResult(
  input: CreateQuestionViewModelResultInput,
): QuestionViewModel {
  return {
    state: getQueryViewState(input.query),
    data: input.data,
    bookmarked: input.bookmark.bookmarked,
    bookmarkError: input.bookmark.error,
    error: input.query.error ?? null,
    reload: async (): Promise<void> => {
      await Promise.all([input.query.refetch(), input.bookmark.reload()]);
    },
    saveBookmark: input.bookmark.save,
    saveDiagnosis: input.actions.saveDiagnosis,
    savePriorKnowledge: input.actions.savePriorKnowledge,
    submit: input.actions.submit,
  };
}
