import type { ContentRow } from "./database/content-row.type";
import type { TopicNavigationReadModel } from "@guesant/saberes-application";

export function mapTopicNavigationReadModel(row: ContentRow): TopicNavigationReadModel {
  return {
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description || ""),
    note: String(row.note || ""),
    relation_type: String(row.relation_type || ""),
  };
}
