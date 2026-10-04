import { saveLessonProgress } from "./save-lesson-progress.function";
import type { AsyncAction } from "../../types/async-action.type";
import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateSaveLessonProgressActionInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
  queryKey: string | undefined;
};

export function createSaveLessonProgressAction(
  input: CreateSaveLessonProgressActionInput,
): AsyncAction<[boolean], void> {
  return async (completed: boolean): Promise<void> => {
    await saveLessonProgress({
      services: input.services,
      contentKey: input.contentKey,
      lesson: input.lesson,
      completed,
    });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "lesson", input.queryKey] });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "lessons"] });
  };
}
