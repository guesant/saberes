import { describe, expect, it } from "vitest";
import { AcademicModality } from "../models/domain.enums";
import { calculateAcademicMetrics } from "./calculate-academic-metrics.function";

describe("calculateAcademicMetrics", () => {
  it("calcula frequência, média e riscos da disciplina", () => {
    const result = calculateAcademicMetrics({
      discipline: {
        id: "discipline:mathematics",
        name: "Matemática",
        modality: AcademicModality.InPerson,
        totalClasses: 20,
        attendedClasses: 15,
        minimumAttendancePercentage: 75,
        minimumGrade: 6,
        grades: [
          {
            id: "grade:first",
            label: "Primeira avaliação",
            value: 5,
            maximum: 10,
            weight: 1,
          },
        ],
        updatedAt: "2026-10-04T00:00:00.000Z",
      },
    });

    expect(result.attendancePercentage)
      .toBe(75);

    expect(result.attendanceRisk)
      .toBe(false);

    expect(result.currentAverage)
      .toBe(5);

    expect(result.requiredFinalGrade)
      .toBe(1);

    expect(result.gradeRisk)
      .toBe(true);
  });
});
