import type {
  ApplicationServices,
  LessonReadModel,
  StudyRecord,
} from "@guesant/saberes-application";

export interface SaveLessonBookmarkInput {
  services: ApplicationServices;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
}

export function saveLessonBookmark(input: SaveLessonBookmarkInput): Promise<StudyRecord> {
  return input.services.lessons.bookmark.execute({
    contentKey: input.contentKey,
    data: {
      lessonId: input.lesson?.id,
      title: input.lesson?.title,
      type: "lesson",
    },
  });
}
