import { createAcademicDiscipline } from "./create-academic-discipline.function";
import type { CreateAcademicDisciplineInput } from "./create-academic-discipline-input.interface";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";

export function createAcademicDisciplineFromForm(
  input: SaveAcademicDisciplineInput,
  id: string,
  updatedAt: string,
): AcademicDiscipline {
  const gradeLabel = input.gradeLabel.trim();

  const grades = gradeLabel
    ? [
      {
        id,
        label: gradeLabel,
        value: input.gradeValue,
        maximum: input.gradeMaximum,
        weight: input.gradeWeight,
      },
    ]
    : [];

  const disciplineInput: CreateAcademicDisciplineInput = {
    attendedClasses: input.attendedClasses,
    grades,
    id,
    name: input.name,
    totalClasses: input.totalClasses,
    updatedAt,
  };

  return createAcademicDiscipline(disciplineInput);
}
