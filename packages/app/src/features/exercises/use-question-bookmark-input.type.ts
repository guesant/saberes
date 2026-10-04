import type { ApplicationServices, QuestionReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type UseQuestionBookmarkInput = {
  data: QuestionReadModel | null;
  key: string | undefined;
  queryClient: QueryClient;
  services: ApplicationServices;
};
