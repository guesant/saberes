import { saveLessonProgress } from "./save-lesson-progress.function";
import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateSaveLessonSectionActionInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
  queryKey: string | undefined;
  completed: boolean;
};

export function createSaveLessonSectionAction(
  input: CreateSaveLessonSectionActionInput,
): (sectionIndex: number) => Promise<void> {
  return async (sectionIndex: number): Promise<void> => {
    await saveLessonProgress({
      services: input.services,
      contentKey: input.contentKey,
      lesson: input.lesson,
      completed: input.completed,
      sectionIndex,
    });

    await input.queryClient.invalidateQueries({
      queryKey: ["progress", "lesson", input.queryKey],
    });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "lessons"] });
  };
}
