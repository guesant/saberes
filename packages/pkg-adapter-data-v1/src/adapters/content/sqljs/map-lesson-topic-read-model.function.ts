import type { ContentRow } from "./database/content-row.type";
import type { LessonTopicReadModel } from "@guesant/saberes-application";

export function mapLessonTopicReadModel(row: ContentRow): LessonTopicReadModel {
  return {
    id: Number(row.id),
    slug: String(row.slug || ""),
    title: String(row.title || ""),
    description: typeof row.description === "string" ? row.description : null,
  };
}
