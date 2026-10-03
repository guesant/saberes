import type { LessonReadModel } from "@guesant/saberes-application";

export interface GetLessonContentKeyInput {
  lesson: LessonReadModel["lesson"] | undefined;
  fallback: string | undefined;
}

export function getLessonContentKey(input: GetLessonContentKeyInput): string {
  return `lesson:${String(input.lesson?.slug || input.fallback)}`;
}
