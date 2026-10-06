import type { ContentRow } from "./database/content-row.type";
import type { TopicLessonReadModel } from "@guesant/saberes-application";

export function mapTopicLessonReadModel(row: ContentRow): TopicLessonReadModel {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description || row.intro || ""),
  };
}
