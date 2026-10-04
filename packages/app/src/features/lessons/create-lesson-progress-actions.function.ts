import { createSaveLessonBookmarkAction } from "./create-save-lesson-bookmark-action.function";
import { createSaveLessonProgressAction } from "./create-save-lesson-progress-action.function";
import { createSaveLessonSectionAction } from "./create-save-lesson-section-action.function";
import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateLessonProgressActionsInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
  queryKey: string | undefined;
  completed: boolean;
};

export function createLessonProgressActions(input: CreateLessonProgressActionsInput) {
  return {
    saveProgress: createSaveLessonProgressAction(input),
    saveBookmark: createSaveLessonBookmarkAction(input),
    saveSection: createSaveLessonSectionAction(input),
  };
}
