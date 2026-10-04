import { describe, expect, it } from "vitest";
import { getReviewRetention } from "./get-review-retention.function";

describe("getReviewRetention", () => {
  it("normaliza uma meta ausente para o valor padrão", () => {
    expect(getReviewRetention(undefined)).toBe(0.9);
  });

  it("mantém a meta dentro dos limites pedagógicos", () => {
    expect(getReviewRetention(0.7)).toBe(0.8);

    expect(getReviewRetention(1)).toBe(0.99);
  });
});
