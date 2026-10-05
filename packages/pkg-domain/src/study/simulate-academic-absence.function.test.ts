import { describe, expect, it } from "vitest";
import { AcademicModality } from "../models/domain.enums";
import { calculateAcademicAbsenceProjection } from "./calculate-academic-absence-projection.function";

describe("calculateAcademicAbsenceProjection", () => {
  it("projects absences without mutating the discipline", () => {
    const discipline = {
      attendedClasses: 8,
      grades: [],
      id: "discipline:1",
      modality: AcademicModality.InPerson,
      minimumAttendancePercentage: 75,
      minimumGrade: 5,
      name: "Disciplina local",
      totalClasses: 10,
      updatedAt: "2026-10-05T00:00:00.000Z",
    };

    const result = calculateAcademicAbsenceProjection({
      additionalAbsences: 2,
      discipline,
    });

    expect(result.attendancePercentage)
      .toBe(66.67);

    expect(discipline.totalClasses)
      .toBe(10);
  });
});
