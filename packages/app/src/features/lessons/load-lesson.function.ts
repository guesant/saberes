import type { ApplicationServices, LessonReadModel } from "@guesant/saberes-application";

export type LoadLessonInput = {
  services: ApplicationServices;
  key: string | undefined;
};

export function loadLesson(input: LoadLessonInput): Promise<LessonReadModel | null> {
  if (!input.key) {
    return Promise.resolve(null);
  }

  return input.services.lessons.get.execute(input.key);
}
