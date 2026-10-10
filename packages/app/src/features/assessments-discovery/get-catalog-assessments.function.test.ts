import { CatalogCardType, type CatalogCard } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getCatalogAssessments } from "./get-catalog-assessments.function";

describe("getCatalogAssessments", () => {
  it("includes official 2025–2027 source resources for consultation without treating other links as exams", () => {
    const cards: CatalogCard[] = [
      { id: "paper-2025", title: "Caderno QZ", type: CatalogCardType.Resource, year: 2025, resourceKind: "official_exam_paper", availabilityMode: "consultation_only" },
      { id: "manual-2027", title: "Manual", type: CatalogCardType.Resource, year: 2027, resourceKind: "official_candidate_manual" },
      { id: "resource-2024", title: "Prova antiga", type: CatalogCardType.Resource, year: 2024, resourceKind: "official_exam_paper" },
      { id: "exercise", title: "Exercício", type: CatalogCardType.Resource, year: 2027, resourceKind: "exercise" },
      { id: "assessment", title: "Simulado publicado", type: CatalogCardType.Assessment },
    ];

    expect(getCatalogAssessments(cards).map((item) => item.id))
      .toEqual(["paper-2025", "manual-2027", "assessment"]);
  });
});
