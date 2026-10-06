import { CatalogCardType } from "@guesant/saberes-domain";
import type { ContentRow } from "./database/content-row.type";
import type { CatalogCard } from "@guesant/saberes-domain";

export function mapAssessmentCatalogCard(row: ContentRow): CatalogCard {
  const processName = String(row.process_name || "");

  const year = Number(row.year) || 0;

  const questionCount = Number(row.question_count) || 0;

  const duration = Number(row.duration_minutes) || 0;

  return {
    id: Number(row.id),
    title: String(row.title || ""),
    description: String(row.description || ""),
    type: CatalogCardType.Assessment,
    slug: String(row.slug || ""),
    meta: [processName, year || "", `${questionCount} questões`, duration ? `${duration} min` : ""].filter(Boolean)
      .join(" · "),
    processName,
    year,
  };
}
