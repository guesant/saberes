import { describe, expect, it } from "vitest";
import { readQuestionPdfPages } from "./read-question-pdf-pages.function";
import type { ContentDatabase } from "./database/content-database.type";
import type { ContentRow } from "./database/content-row.type";

const sourceRows: ContentRow[] = [
  { occurrence_id: 10, source_page: 5, year: 2027, edition_slug: "unicamp-2027", paper_name: "Simulado", paper_version_code: "QT", paper_version_name: "Q/T", pdf_path: "official-pdfs/simulado-QT.pdf" },
  { occurrence_id: 11, source_page: 19, year: 2027, edition_slug: "unicamp-2027", paper_name: "Simulado", paper_version_code: "RS", paper_version_name: "R/S", pdf_path: "official-pdfs/simulado-RS.pdf" },
  { occurrence_id: 12, source_page: 7, year: 2026, edition_slug: "unicamp-2026", paper_name: "Prova 2026", paper_version_code: "QX", paper_version_name: "Q/X", pdf_path: "official-pdfs/2026/QX.pdf" },
  { occurrence_id: 13, source_page: 9, year: 2025, edition_slug: "unicamp-2025", paper_name: "Prova 2025", paper_version_code: "QZ", paper_version_name: "Q/Z", pdf_path: "official-pdfs/2025/QZ.pdf" },
];

export function createDatabase(): ContentDatabase {
  return {
    source: "fixture",
    get: () => {return null;},
    query(sql, params = []) {
      expect(sql)
        .toContain("COALESCE(qo.source_document_id, pv.source_document_id, p.source_document_id)");

      if (sql.includes("AND qo.id = ?")) {
        return sourceRows.filter((row) => {return Number(row.occurrence_id) === Number(params[1]);});
      }

      return sourceRows;
    },
  };
}

describe("readQuestionPdfPages", () => {
  it("chooses one representative shuffled caderno per edition, preferring the target edition", () => {
    const pages = readQuestionPdfPages(createDatabase(), 99, null, "unicamp-2027");

    expect(pages.map(({ year, paperVersionCode, occurrenceId }) => {return { year, paperVersionCode, occurrenceId };}))
      .toEqual([
        { year: 2027, paperVersionCode: "QT", occurrenceId: 10 },
        { year: 2026, paperVersionCode: "QX", occurrenceId: 12 },
        { year: 2025, paperVersionCode: "QZ", occurrenceId: 13 },
      ]);
  });

  it("keeps the exact caderno occurrence on an occurrence route", () => {
    const pages = readQuestionPdfPages(createDatabase(), 99, 11);

    expect(pages)
      .toHaveLength(1);

    expect(pages[0])
      .toMatchObject({ occurrenceId: 11, page: 19, paperVersionCode: "RS" });
  });
});
