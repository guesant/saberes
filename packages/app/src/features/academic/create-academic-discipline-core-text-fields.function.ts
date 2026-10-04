import { createAcademicDisciplineNumberTextField } from "./create-academic-discipline-number-text-field.function";
import type { AcademicDisciplineFormState } from "./academic-discipline-form-state.interface";
import type { AcademicDisciplineTextFieldProps } from "./academic-discipline-text-field.component";
import type { TFunction } from "i18next";

export function createAcademicDisciplineCoreTextFields(
  form: AcademicDisciplineFormState,
  translate: TFunction,
): AcademicDisciplineTextFieldProps[] {
  return [
    { label: translate("academic.name"), onChange: form.onNameChange, value: form.name },
    createAcademicDisciplineNumberTextField({
      inputStep: 1,
      label: translate("academic.totalClasses"),
      onChange: form.onTotalClassesChange,
      value: form.totalClasses,
    }),
    createAcademicDisciplineNumberTextField({
      inputStep: 1,
      label: translate("academic.attendedClasses"),
      onChange: form.onAttendedClassesChange,
      value: form.attendedClasses,
    }),
  ];
}
