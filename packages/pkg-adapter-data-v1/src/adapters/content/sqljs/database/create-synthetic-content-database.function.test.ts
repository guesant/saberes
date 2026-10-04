import { describe, expect, it } from "vitest";
import { createSyntheticContentDatabase } from "./create-synthetic-content-database.function";

describe("createSyntheticContentDatabase", () => {
  it("provides a local study cycle without editorial storage", () => {
    const database = createSyntheticContentDatabase();

    expect(database.source)
      .toBe("synthetic-fixture");

    expect(database.query("SELECT * FROM learning_courses WHERE slug = ?", ["1"]))
      .toHaveLength(1);

    expect(database.query("SELECT * FROM lessons WHERE (slug = ? OR id = ?)", ["1"]))
      .toHaveLength(
        1,
      );

    expect(
      database.query("SELECT qo.id occurrence_id FROM question_occurrences", ["1"]),
    )
      .toHaveLength(1);

    expect(database.query("SELECT * FROM study_plans WHERE is_published = 1", [""]))
      .toHaveLength(
        1,
      );
  });

  it("does not pretend unknown content exists", () => {
    const database = createSyntheticContentDatabase();

    expect(database.query("SELECT * FROM lessons WHERE (slug = ? OR id = ?)", ["missing"]))
      .toEqual(
        [],
      );

    expect(
      database.query("SELECT * FROM learning_maps WHERE is_published = 1", ["missing"]),
    )
      .toEqual([]);
  });
});
