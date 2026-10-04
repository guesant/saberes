import { describe, expect, it } from "vitest";
import { collectContentSnapshotValidationInput } from "./collect-content-snapshot-validation-input.function";
import type { ContentDatabase } from "./database/content-database.type";

const validationQueries = new Map<string, Array<Record<string, unknown>>>([
  ["SELECT name FROM sqlite_master", [{ name: "questions" }]],
  ["SELECT COUNT(*) count FROM questions", [{ count: 3 }]],
  ["SELECT COUNT(*) count FROM admission_processes", [{ count: 2 }]],
  ["SELECT COUNT(*) count FROM learning_courses", [{ count: 1 }]],
  ["SELECT COUNT(*) count FROM assessment_sets", [{ count: 4 }]],
]);

describe("getContentSnapshotValidationInput", () => {
  it("collects snapshot counts and table names through the database contract", () => {
    const database: ContentDatabase = {
      source: "test",
      query(sql: string) {
        return (
          [...validationQueries.entries()].find(([prefix]) => {
            return sql.startsWith(prefix);
          })?.[1] || [{ count: 0 }]
        );
      },
      get() {
        return null;
      },
    };

    expect(collectContentSnapshotValidationInput(database))
      .toMatchObject({
        tables: ["questions"],
        questionCount: 3,
        publishedProcessCount: 2,
        publishedCourseCount: 1,
        assessmentSetCount: 4,
        orphanOccurrenceCount: 0,
      });
  });
});
