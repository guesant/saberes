import { calculateAcademicFrequency } from "./calculate-academic-frequency.function";
import type { CalculateAcademicMetricsInput } from "./calculate-academic-metrics-input.interface";
import type { AcademicMetrics } from "../models/academic-metrics.interface";

export function calculateAcademicMetrics(input: CalculateAcademicMetricsInput): AcademicMetrics {
  const { discipline } = input;

  const attendancePercentage = calculateAcademicFrequency(
    discipline.totalClasses,
    discipline.attendedClasses,
  );

  const weightedTotal = discipline.grades.reduce((total, grade) => {
    return total + grade.weight;
  }, 0);

  const currentAverage = weightedTotal
    ? (discipline.grades.reduce((total, grade) => {
      return total + (grade.value / grade.maximum) * grade.weight;
    }, 0) /
        weightedTotal) *
      10
    : 0;

  const requiredFinalGrade =
    weightedTotal < 1
      ? null
      : Math.max(0, Math.round((discipline.minimumGrade - currentAverage) * 100) / 100);

  return {
    disciplineId: discipline.id,
    attendancePercentage,
    attendanceRisk: attendancePercentage < discipline.minimumAttendancePercentage,
    currentAverage: Math.round(currentAverage * 100) / 100,
    requiredFinalGrade,
    gradeRisk: currentAverage < discipline.minimumGrade,
  };
}
