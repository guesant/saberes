import type { LessonTopicReadModel } from "@guesant/saberes-application";

export function getLessonPracticeHref(topics: LessonTopicReadModel[]): string | null {
  const topic = topics[0];

  if (!topic) {
    return null;
  }

  return `/topicos/${encodeURIComponent(topic.slug)}#pratica`;
}
