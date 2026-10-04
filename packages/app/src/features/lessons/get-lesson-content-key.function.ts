import type { LessonReadModel } from "@guesant/saberes-application";

export interface GetLessonContentKeyInput {
  lesson: LessonReadModel["lesson"] | undefined;
  fallback: string | undefined;
}

export function getLessonContentKey(input: GetLessonContentKeyInput): string {
  const fallback = input.fallback?.startsWith("lesson:")
    ? input.fallback.slice("lesson:".length)
    : input.fallback;

  return `lesson:${String(input.lesson?.slug || fallback)}`;
}
