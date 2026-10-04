import { createAcademicDisciplineCoreTextFields } from "./create-academic-discipline-core-text-fields.function";
import { createAcademicDisciplineGradeTextFields } from "./create-academic-discipline-grade-text-fields.function";
import type { AcademicDisciplineFormState } from "./academic-discipline-form-state.interface";
import type { AcademicDisciplineTextFieldProps } from "./academic-discipline-text-field.component";
import type { TFunction } from "i18next";

export function createAcademicDisciplineTextFields(
  form: AcademicDisciplineFormState,
  translate: TFunction,
): AcademicDisciplineTextFieldProps[] {
  return [
    ...createAcademicDisciplineCoreTextFields(form, translate),
    ...createAcademicDisciplineGradeTextFields(form, translate),
  ];
}
