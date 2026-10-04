import { describe, expect, it } from "vitest";
import { getCourseStarted } from "./get-course-started.function";
import type { StudyRecord } from "@guesant/saberes-application";

describe("estado de inscrição no curso", () => {
  it("identifica a inscrição pelo contentKey estável", () => {
    const records: StudyRecord[] = [{ contentKey: "course:algebra" }];

    expect(getCourseStarted({ records, slug: "algebra" }))
      .toBe(true);
  });

  it("retorna falso para curso sem inscrição", () => {
    expect(getCourseStarted({ records: [], slug: "algebra" }))
      .toBe(false);
  });
});
