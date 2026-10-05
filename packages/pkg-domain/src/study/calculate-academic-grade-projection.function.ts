import { calculateAcademicMetrics } from "./calculate-academic-metrics.function";
import type { SimulateAcademicGradeInput } from "./simulate-academic-grade-input.interface";
import type { AcademicMetrics } from "../models/academic-metrics.interface";

export function calculateAcademicGradeProjection(
  input: SimulateAcademicGradeInput,
): AcademicMetrics {
  return calculateAcademicMetrics({
    discipline: {
      ...input.discipline,
      grades: [...input.discipline.grades, input.grade],
    },
  });
}
