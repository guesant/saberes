import { syncStudyAchievements } from "../my-study/sync-study-achievements.function";
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
  sectionIndex?: number;
}

export async function saveLessonProgress(input: SaveLessonProgressInput): Promise<StudyRecord> {
  const record = await input.services.lessons.saveProgress.execute({
    contentKey: input.contentKey,
    data: {
      lessonId: input.lesson?.id,
      completed: input.completed,
      sectionIndex: input.sectionIndex,
    },
  });

  if (input.completed) {
    await input.services.study.recordStudyActivity.execute({ type: "lesson" });

    await syncStudyAchievements(input.services);
  }

  return record;
}
