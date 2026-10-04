import type { LessonReadModel } from "@guesant/saberes-application";

export type LessonViewData = {
  data: LessonReadModel | null;
  lesson: LessonReadModel["lesson"] | undefined;
};

export function getLessonViewData(data: LessonReadModel | null | undefined): LessonViewData {
  if (!data) {
    return { data: null, lesson: undefined };
  }

  return { data, lesson: data.lesson };
}
