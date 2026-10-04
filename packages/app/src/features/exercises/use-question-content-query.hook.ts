import { useQuery } from "@tanstack/react-query";
import type { UseQuestionContentQueryInput } from "./use-question-content-query-input.type";

export function useQuestionContentQuery(input: UseQuestionContentQueryInput) {
  return useQuery({
    queryKey: ["question", input.key],
    enabled: Boolean(input.key),
    queryFn: () => {
      if (!input.key) {
        return Promise.resolve(null);
      }

      return input.services.exercises.get.execute(input.key);
    },
  });
}
