import type { ContentRow } from "./database/content-row.type";
import type { QuestionTopicReadModel } from "@guesant/saberes-application";

export function mapQuestionTopicReadModel(row: ContentRow): QuestionTopicReadModel {
  return {
    topic_id: Number(row.topic_id),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
  };
}
