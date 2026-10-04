import { parseAcademicNumber } from "./parse-academic-number.function";
import type { AcademicDisciplineFormValues } from "./academic-discipline-form-values.interface";
import type { SaveAcademicDisciplineInput } from "./save-academic-discipline-input.interface";

export function createAcademicDisciplineSaveInput(
  values: AcademicDisciplineFormValues,
): SaveAcademicDisciplineInput {
  return {
    attendedClasses: parseAcademicNumber(values.attendedClasses, 0),
    gradeLabel: values.gradeLabel.trim(),
    gradeMaximum: parseAcademicNumber(values.gradeMaximum, 10),
    gradeValue: parseAcademicNumber(values.gradeValue, 0),
    gradeWeight: parseAcademicNumber(values.gradeWeight, 1),
    name: values.name.trim(),
    totalClasses: parseAcademicNumber(values.totalClasses, 0),
  };
}
