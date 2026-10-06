import { saveLessonBookmark } from "./save-lesson-bookmark.function";
import type { AsyncAction } from "../../types/async-action.type";
import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateSaveLessonBookmarkActionInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
  bookmarked: boolean;
};

export function createSaveLessonBookmarkAction(
  input: CreateSaveLessonBookmarkActionInput,
): AsyncAction<[], void> {
  return async (): Promise<void> => {
    if (input.bookmarked) {
      await input.services.progress.removeBookmark.execute(input.contentKey);
    } else {
      await saveLessonBookmark({
        services: input.services,
        contentKey: input.contentKey,
        lesson: input.lesson,
      });
    }

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "bookmarks"] });
  };
}
