import type { ContentRow } from "./database/content-row.type";
import type { TopicQuestionReadModel } from "@guesant/saberes-application";

export function mapTopicQuestionReadModel(row: ContentRow): TopicQuestionReadModel {
  return {
    id: Number(row.id),
    slug: String(row.slug || ""),
    number: Number(row.number) || null,
    statement: String(row.statement || ""),
    difficulty: String(row.difficulty || ""),
    href: row.occurrence_id
      ? `/questoes/${Number(row.occurrence_id)}`
      : `/exercicios/${String(row.slug)}`,
    sourceEditionYear: Number(row.source_edition_year) || undefined,
    sourceStageName: String(row.source_stage_name || "") || undefined,
    sourcePaperName: String(row.source_paper_name || "") || undefined,
    sourceBookletName: String(row.source_booklet_name || "") || undefined,
    classificationType: String(row.classification_type || "related") as "primary" | "secondary" | "related",
    classificationConfidence:
      row.classification_confidence === undefined || row.classification_confidence === null
        ? null
        : Number(row.classification_confidence),
    classificationSourceTitle: String(row.classification_source_title || "") || undefined,
    classificationSourceUrl: String(row.classification_source_url || "") || undefined,
    classificationSourcePage: Number(row.classification_source_page) || undefined,
    classificationSourceExcerpt: String(row.classification_source_excerpt || "") || undefined,
  };
}
