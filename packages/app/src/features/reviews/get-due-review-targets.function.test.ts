import { describe, expect, it } from "vitest";
import { getDueReviewTargets } from "./get-due-review-targets.function";
import type { ReviewTarget } from "@guesant/saberes-application";

describe("seleção de revisões vencidas", () => {
  it("inclui itens sem data e itens vencidos", () => {
    const targets: ReviewTarget[] = [
      { contentKey: "question:without-date" },
      { contentKey: "question:overdue", dueAt: "2026-10-02T10:00:00.000Z" },
      { contentKey: "question:future", dueAt: "2026-10-04T10:00:00.000Z" },
    ];

    const result = getDueReviewTargets(targets, new Date("2026-10-03T12:00:00.000Z"));

    expect(result).toMatchObject([
      { contentKey: "question:without-date" },
      { contentKey: "question:overdue" },
    ]);
  });

  it("não inclui itens suspensos", () => {
    const targets: ReviewTarget[] = [{ contentKey: "question:suspended", suspended: true }];

    expect(getDueReviewTargets(targets, new Date("2026-10-03T12:00:00.000Z"))).toEqual([]);
  });
});
