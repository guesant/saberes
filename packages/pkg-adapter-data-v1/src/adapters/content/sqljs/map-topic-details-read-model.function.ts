import type { ContentRow } from "./database/content-row.type";
import type { TopicDetailsReadModel } from "@guesant/saberes-application";

export function mapTopicDetailsReadModel(row: ContentRow): TopicDetailsReadModel {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description || ""),
    parent_id: Number(row.parent_id) || null,
  };
}
