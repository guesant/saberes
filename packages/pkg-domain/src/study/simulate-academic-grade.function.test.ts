import { describe, expect, it } from "vitest";
import { AcademicModality } from "../models/domain.enums";
import { calculateAcademicGradeProjection } from "./calculate-academic-grade-projection.function";

describe("calculateAcademicGradeProjection", () => {
  it("projects a new grade without mutating the discipline", () => {
    const discipline = {
      attendedClasses: 10,
      grades: [],
      id: "discipline:1",
      modality: AcademicModality.InPerson,
      minimumAttendancePercentage: 75,
      minimumGrade: 5,
      name: "Disciplina local",
      totalClasses: 10,
      updatedAt: "2026-10-05T00:00:00.000Z",
    };

    const result = calculateAcademicGradeProjection({
      discipline,
      grade: {
        id: "grade:1",
        label: "Avaliação",
        maximum: 10,
        value: 8,
        weight: 1,
      },
    });

    expect(result.currentAverage)
      .toBe(8);

    expect(discipline.grades)
      .toHaveLength(0);
  });
});
