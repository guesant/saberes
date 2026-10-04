import { AcademicModality } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { createAcademicDiscipline } from "./create-academic-discipline.function";

describe("createAcademicDiscipline", () => {
  it("preserves local grades and academic thresholds", () => {
    const discipline = createAcademicDiscipline({
      attendedClasses: 18,
      grades: [
        {
          id: "grade:1",
          label: "Avaliação 1",
          maximum: 10,
          value: 8,
          weight: 2,
        },
      ],
      id: "discipline:1",
      name: "Disciplina local",
      totalClasses: 20,
      updatedAt: "2026-10-04T00:00:00.000Z",
    });

    expect(discipline.modality)
      .toBe(AcademicModality.InPerson);

    expect(discipline.grades)
      .toHaveLength(1);

    expect(discipline.grades[0].value)
      .toBe(8);

    expect(discipline.minimumAttendancePercentage)
      .toBe(75);

    expect(discipline.minimumGrade)
      .toBe(5);
  });
});
