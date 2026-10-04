import { saveLessonBookmark } from "./save-lesson-bookmark.function";
import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateSaveLessonBookmarkActionInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
};

export function createSaveLessonBookmarkAction(
  input: CreateSaveLessonBookmarkActionInput,
): () => Promise<void> {
  return async (): Promise<void> => {
    await saveLessonBookmark({
      services: input.services,
      contentKey: input.contentKey,
      lesson: input.lesson,
    });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "bookmarks"] });
  };
}
