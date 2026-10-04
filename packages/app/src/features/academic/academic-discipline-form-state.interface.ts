import type { AcademicDisciplineFormValues } from "./academic-discipline-form-values.interface";

export interface AcademicDisciplineFormState extends AcademicDisciplineFormValues {
  onAttendedClassesChange(value: string): void;

  onGradeLabelChange(value: string): void;

  onGradeMaximumChange(value: string): void;

  onGradeValueChange(value: string): void;

  onGradeWeightChange(value: string): void;

  onNameChange(value: string): void;

  onSave(): Promise<void>;

  onTotalClassesChange(value: string): void;
}
