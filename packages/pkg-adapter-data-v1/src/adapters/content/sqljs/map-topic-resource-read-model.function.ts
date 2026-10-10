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
    editorialStatus: String(row.editorial_status || "review") as "draft" | "review" | "published",
    editorialNote: String(row.editorial_note || ""),
    availabilityMode: String(row.availability_mode || "reference") as
      "learning" | "practice" | "consultation_only" | "reference",
    relationStatus: String(row.topic_review_status || "review") as "draft" | "review" | "published",
    relevanceStatus: String(row.topic_relevance_status || "unknown") as
      "unknown" | "relevant" | "not_relevant",
    accessibilityStatus: String(row.topic_accessibility_status || "unknown") as
      "unknown" | "checked" | "needs_improvement",
    relationNote: String(row.topic_review_note || ""),
    reuseStatus: String(row.reuse_status || "unknown") as
      "unknown" | "link_only" | "open_license" | "public_domain" | "permission_confirmed",
    licenseName: String(row.license_name || ""),
    licenseUrl: String(row.license_url || ""),
    attribution: String(row.attribution || ""),
    rightsNote: String(row.rights_note || ""),
  };
}
