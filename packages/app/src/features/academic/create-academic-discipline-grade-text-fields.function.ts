import { createAcademicDisciplineNumberTextField } from "./create-academic-discipline-number-text-field.function";
import type { AcademicDisciplineFormState } from "./academic-discipline-form-state.interface";
import type { AcademicDisciplineTextFieldProps } from "./academic-discipline-text-field.component";
import type { TFunction } from "i18next";

export function createAcademicDisciplineGradeTextFields(
  form: AcademicDisciplineFormState,
  translate: TFunction,
): AcademicDisciplineTextFieldProps[] {
  return [
    {
      label: translate("academic.gradeLabel"),
      onChange: form.onGradeLabelChange,
      value: form.gradeLabel,
    },
    createAcademicDisciplineNumberTextField({
      inputStep: 0.01,
      label: translate("academic.gradeValue"),
      onChange: form.onGradeValueChange,
      value: form.gradeValue,
    }),
    createAcademicDisciplineNumberTextField({
      inputStep: 0.01,
      label: translate("academic.gradeMaximum"),
      onChange: form.onGradeMaximumChange,
      value: form.gradeMaximum,
    }),
    createAcademicDisciplineNumberTextField({
      inputStep: 0.01,
      label: translate("academic.gradeWeight"),
      onChange: form.onGradeWeightChange,
      value: form.gradeWeight,
    }),
  ];
}
