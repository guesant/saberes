import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { createQuestionDiagnosisAction } from "./create-question-diagnosis-action.function";
import { createQuestionSubmissionAction } from "./create-question-submission-action.function";
import { useQuestionBookmark } from "./use-question-bookmark.hook";
import { useQuestionContentQuery } from "./use-question-content-query.hook";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type {
  AttemptConfidence,
  DiagnosisCode,
  QuestionReadModel,
} from "@guesant/saberes-application";

export type QuestionViewModelState = "loading" | "error" | "ready";

export interface QuestionViewModel {
  state: QuestionViewModelState;
  data: QuestionReadModel | null;
  bookmarked: boolean;
  bookmarkError: Error | null;
  error: Error | null;
  reload: () => Promise<void>;
  saveBookmark: () => Promise<void>;
  submit: (
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ) => Promise<QuestionSubmissionResult>;
  saveDiagnosis: (code: DiagnosisCode) => Promise<void>;
}

export function useQuestionViewModel(key: string | undefined): QuestionViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const [attemptId, setAttemptId] = useState<string | null>(null);

  const query = useQuestionContentQuery({ key, services });

  const data = query.data || null;

  const bookmark = useQuestionBookmark({
    data,
    key,
    queryClient,
    services,
  });

  const submitAnswer = createQuestionSubmissionAction({
    data,
    queryClient,
    services,
    setAttemptId,
  });

  const saveDiagnosis = createQuestionDiagnosisAction({ attemptId, services });

  const state: QuestionViewModelState = getQueryViewState(query);

  return {
    state,
    data,
    bookmarked: bookmark.bookmarked,
    bookmarkError: bookmark.error,
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await Promise.all([query.refetch(), bookmark.reload()]);
    },
    saveBookmark: bookmark.save,
    submit: submitAnswer,
    saveDiagnosis,
  };
}
