import { calculateAcademicMetrics } from "./calculate-academic-metrics.function";
import type { SimulateAcademicAbsenceInput } from "./simulate-academic-absence-input.interface";
import type { AcademicMetrics } from "../models/academic-metrics.interface";

export function calculateAcademicAbsenceProjection(
  input: SimulateAcademicAbsenceInput,
): AcademicMetrics {
  const additionalAbsences = Math.max(0, Math.trunc(input.additionalAbsences));

  return calculateAcademicMetrics({
    discipline: {
      ...input.discipline,
      totalClasses: input.discipline.totalClasses + additionalAbsences,
    },
  });
}
