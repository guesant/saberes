import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";

export interface QuestionPdfPageReadModel {
  occurrenceId: number;
  path: string;
  page: number;
  year: number;
  editionSlug: string;
  paperVersionCode: string | null;
  paperVersionName: string | null;
  paperName: string;
}

export function readQuestionPdfPages(
  db: ContentDatabase,
  questionId: number,
  occurrenceId?: number | null,
  targetEditionSlug?: string,
): QuestionPdfPageReadModel[] {
  const occurrenceFilter = occurrenceId == null ? "" : " AND qo.id = ?";

  const params: unknown[] = [questionId];

  if (occurrenceId != null) {
    params.push(occurrenceId);
  }

  params.push(targetEditionSlug || "", targetEditionSlug || "");

  const rows = db.query(
    `SELECT qo.id occurrence_id, qo.source_page, e.year, e.slug edition_slug,
        p.name paper_name, pv.code paper_version_code, pv.name paper_version_name, a.path pdf_path
      FROM question_occurrences qo
      JOIN papers p ON p.id = qo.paper_id
      JOIN stages st ON st.id = p.stage_id
      JOIN editions e ON e.id = st.edition_id
      LEFT JOIN paper_versions pv ON pv.id = qo.paper_version_id
      JOIN source_documents sd ON sd.id = COALESCE(qo.source_document_id, pv.source_document_id, p.source_document_id)
      JOIN content_assets a ON a.source_document_id = sd.id AND lower(a.media_type) = 'application/pdf'
      WHERE qo.question_id = ? AND qo.source_page IS NOT NULL${occurrenceFilter}
      ORDER BY CASE WHEN ? <> '' AND e.slug = ? THEN 0 ELSE 1 END,
        e.year DESC, COALESCE(pv.code, p.slug), qo.id`,
    params,
  );

  const mapped = rows.map(mapQuestionPdfPageReadModel);

  if (occurrenceId != null) {
    return mapped;
  }

  // Canonical questions may occur in multiple shuffled cadernos. Keep one
  // representative caderno per edition so the source list stays useful.
  const representativePages = new Map<string, QuestionPdfPageReadModel>();

  for (const page of mapped) {
    if (!representativePages.has(page.editionSlug)) {
      representativePages.set(page.editionSlug, page);
    }
  }

  return [...representativePages.values()];
}

export function mapQuestionPdfPageReadModel(row: ContentRow): QuestionPdfPageReadModel {
  return {
    occurrenceId: Number(row.occurrence_id),
    path: String(row.pdf_path),
    page: Number(row.source_page),
    year: Number(row.year),
    editionSlug: String(row.edition_slug),
    paperVersionCode: row.paper_version_code == null ? null : String(row.paper_version_code),
    paperVersionName: row.paper_version_name == null ? null : String(row.paper_version_name),
    paperName: String(row.paper_name),
  };
}
