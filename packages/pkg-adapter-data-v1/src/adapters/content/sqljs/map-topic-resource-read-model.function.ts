import type { ContentRow } from "./database/content-row.type";
import type { TopicResourceReadModel } from "@guesant/saberes-application";

export function mapTopicResourceReadModel(row: ContentRow): TopicResourceReadModel {
  return {
    id: Number(row.id),
    title: String(row.title),
    description: String(row.description || ""),
    url: String(row.url),
    kind: String(row.kind || ""),
    provider: String(row.provider || ""),
    isExternal: /^https?:\/\//u.test(String(row.url)),
  };
}
