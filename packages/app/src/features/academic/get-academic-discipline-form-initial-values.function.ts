import type { AcademicDisciplineFormValues } from "./academic-discipline-form-values.interface";
import type { AcademicDiscipline } from "@guesant/saberes-application";

export function getAcademicDisciplineFormInitialValues(
  discipline?: AcademicDiscipline,
): AcademicDisciplineFormValues {
  if (!discipline) {
    return {
      attendedClasses: "0",
      gradeLabel: "",
      gradeMaximum: "10",
      gradeValue: "0",
      gradeWeight: "1",
      name: "",
      totalClasses: "0",
    };
  }

  const grade = discipline.grades[0] || {
    label: "",
    maximum: 10,
    value: 0,
    weight: 1,
  };

  return {
    attendedClasses: String(discipline.attendedClasses),
    gradeLabel: grade.label,
    gradeMaximum: String(grade.maximum),
    gradeValue: String(grade.value),
    gradeWeight: String(grade.weight),
    name: discipline.name,
    totalClasses: String(discipline.totalClasses),
  };
}
