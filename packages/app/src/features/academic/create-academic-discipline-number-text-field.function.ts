import type { AcademicDisciplineTextFieldProps } from "./academic-discipline-text-field.component";
import type { CreateAcademicDisciplineNumberTextFieldInput } from "./create-academic-discipline-number-text-field-input.interface";

export function createAcademicDisciplineNumberTextField(
  input: CreateAcademicDisciplineNumberTextFieldInput,
): AcademicDisciplineTextFieldProps {
  return { inputMin: 0, ...input, type: "number" };
}
