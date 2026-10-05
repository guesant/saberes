import { useState } from "react";
import { createAcademicDisciplineSaveInput } from "./create-academic-discipline-save-input.function";
import { getAcademicDisciplineFormInitialValues } from "./get-academic-discipline-form-initial-values.function";
import type { AcademicDisciplineFormSave } from "./academic-discipline-form-save.interface";
import type { AcademicDisciplineFormState } from "./academic-discipline-form-state.interface";
import type { AcademicDisciplineFormValues } from "./academic-discipline-form-values.interface";

const initialValues: AcademicDisciplineFormValues = {
  attendedClasses: "0",
  gradeLabel: "",
  gradeMaximum: "10",
  gradeValue: "0",
  gradeWeight: "1",
  name: "",
  totalClasses: "0",
};

export function useAcademicDisciplineForm(
  props: AcademicDisciplineFormSave,
): AcademicDisciplineFormState {
  const [values, setValues] = useState(() => {
    return props.initialDiscipline
      ? getAcademicDisciplineFormInitialValues(props.initialDiscipline)
      : initialValues;
  });

  const createAcademicFieldUpdater = (field: keyof AcademicDisciplineFormValues) => {
    return (value: string): void => {
      setValues((current) => {
        return { ...current, [field]: value };
      });
    };
  };

  const save = async (): Promise<void> => {
    if (!values.name.trim()) {
      return;
    }

    await props.onSave(createAcademicDisciplineSaveInput(values));

    setValues(initialValues);
  };

  return {
    ...values,
    onAttendedClassesChange: createAcademicFieldUpdater("attendedClasses"),
    onGradeLabelChange: createAcademicFieldUpdater("gradeLabel"),
    onGradeMaximumChange: createAcademicFieldUpdater("gradeMaximum"),
    onGradeValueChange: createAcademicFieldUpdater("gradeValue"),
    onGradeWeightChange: createAcademicFieldUpdater("gradeWeight"),
    onNameChange: createAcademicFieldUpdater("name"),
    onSave: save,
    onTotalClassesChange: createAcademicFieldUpdater("totalClasses"),
  };
}
