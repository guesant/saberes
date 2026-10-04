import { describe, expect, it } from "vitest";
import { getReviewLoadSummary } from "./get-review-load-summary.function";

describe("getReviewLoadSummary", () => {
  it("separa vencidas, próximas e suspensas", () => {
    const result = getReviewLoadSummary(
      [
        { contentKey: "question:1", dueAt: "2026-10-03T00:00:00.000Z" },
        { contentKey: "question:2", dueAt: "2026-10-05T00:00:00.000Z" },
        { contentKey: "question:3", suspended: true },
      ],
      new Date("2026-10-04T12:00:00.000Z"),
    );

    expect(result).toEqual({ due: 1, upcoming: 1, suspended: 1, total: 3 });
  });
});
