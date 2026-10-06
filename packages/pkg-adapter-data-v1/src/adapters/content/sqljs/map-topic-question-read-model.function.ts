import type { ContentRow } from "./database/content-row.type";
import type { TopicQuestionReadModel } from "@guesant/saberes-application";

export function mapTopicQuestionReadModel(row: ContentRow): TopicQuestionReadModel {
  return {
    id: Number(row.id),
    slug: String(row.slug || ""),
    number: Number(row.number) || null,
    statement: String(row.statement || ""),
    difficulty: String(row.difficulty || ""),
    href: row.occurrence_id ? `/questoes/${Number(row.occurrence_id)}` : `/exercicios/${String(row.slug)}`,
  };
}
