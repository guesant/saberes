import type {
  ApplicationServices,
  LessonReadModel,
  StudyRecord,
} from "@guesant/saberes-application";

export interface SaveLessonProgressInput {
  services: ApplicationServices;
  contentKey: string;
  lesson: LessonReadModel["lesson"] | undefined;
  completed: boolean;
}

export function saveLessonProgress(input: SaveLessonProgressInput): Promise<StudyRecord> {
  return input.services.lessons.saveProgress.execute({
    contentKey: input.contentKey,
    data: {
      lessonId: input.lesson?.id,
      completed: input.completed,
    },
  });
}
