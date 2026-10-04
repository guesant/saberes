import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getPrioritizedQuestionSessionQuestions } from "./get-prioritized-question-session-questions.function";
import type { CatalogCard } from "@guesant/saberes-application";

export function usePrioritizedQuestionSessionQuestions(questions: CatalogCard[]): CatalogCard[] {
  const services = useAppServices();

  const attemptsQuery = useQuery({
    queryKey: ["progress", "attempts"],
    queryFn: () => {
      return services.progress.listAttempts.execute();
    },
  });

  return getPrioritizedQuestionSessionQuestions({
    attempts: attemptsQuery.data || [],
    questions,
  });
}
