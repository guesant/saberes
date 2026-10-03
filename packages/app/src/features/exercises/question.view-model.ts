import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQueryViewState } from "../../view-models/get-query-view-state.function";
import { submitQuestionAnswer } from "./submit-question-answer.function";
import type { QuestionReadModel } from "@guesant/saberes-application";

export type QuestionViewModelState = "loading" | "error" | "ready";

export interface QuestionViewModel {
  state: QuestionViewModelState;
  data: QuestionReadModel | null;
  error: Error | null;
  reload: () => Promise<void>;
  submit: (answer: string) => Promise<boolean | null>;
}

export function useQuestionViewModel(key: string | undefined): QuestionViewModel {
  const services = useAppServices();

  const query = useQuery({
    queryKey: ["question", key],
    enabled: Boolean(key),
    queryFn: () => {
      if (!key) {
        return Promise.resolve(null);
      }

      return services.exercises.get.execute(key);
    },
  });

  const submitAnswer = (answer: string): Promise<boolean | null> => {
    if (query.data) {
      return submitQuestionAnswer({ services, data: query.data, answer });
    }

    return Promise.resolve(null);
  };

  const state: QuestionViewModelState = getQueryViewState(query);

  return {
    state,
    data: query.data ?? null,
    error: query.error ?? null,
    reload: async (): Promise<void> => {
      await query.refetch();
    },
    submit: submitAnswer,
  };
}
