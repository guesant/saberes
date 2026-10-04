import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { lessonMetadataSchema } from "./lesson-metadata.schema";

describe("lessonMetadataSchema", () => {
  it("accepts complete published metadata", () => {
    const result = safeParse(lessonMetadataSchema, {
      objective: "Interpretar uma relação entre grandezas.",
      audience: "estudantes",
      level: "basic",
      estimatedMinutes: 15,
      prerequisites: [],
      sources: ["https://saberes.guesant.net/reference/lesson"],
      editorialVersion: "1.0.0",
      reviewStatus: "published",
    });

    expect(result.success).toBe(true);
  });

  it("rejects published metadata without a source", () => {
    const result = safeParse(lessonMetadataSchema, {
      objective: "Interpretar uma relação entre grandezas.",
      audience: "estudantes",
      level: "basic",
      estimatedMinutes: 15,
      prerequisites: [],
      sources: [],
      editorialVersion: "1.0.0",
      reviewStatus: "published",
    });

    expect(result.success).toBe(false);
  });
});
