import { AcademicModality, type AcademicDiscipline } from "@guesant/saberes-application";
import type { CreateAcademicDisciplineInput } from "./create-academic-discipline-input.interface";

export function createAcademicDiscipline(input: CreateAcademicDisciplineInput): AcademicDiscipline {
  return {
    id: input.id,
    name: input.name,
    modality: AcademicModality.InPerson,
    totalClasses: input.totalClasses,
    attendedClasses: input.attendedClasses,
    minimumAttendancePercentage: 75,
    minimumGrade: 5,
    grades: input.grades,
    updatedAt: input.updatedAt,
  };
}
