import { UIContentGroup, UIResponsiveFields, UIButton, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineTextField } from "./academic-discipline-text-field.component";
import { createAcademicDisciplineTextFields } from "./create-academic-discipline-text-fields.function";
import type { AcademicDisciplineFormState } from "./academic-discipline-form-state.interface";

export interface AcademicDisciplineFieldsProps {
  form: AcademicDisciplineFormState;
}

export function AcademicDisciplineFields(props: AcademicDisciplineFieldsProps) {
  const { t } = useTranslation();

  const fields = createAcademicDisciplineTextFields(props.form, t);

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{t("academic.newDiscipline")}</UITypography>
      <UIResponsiveFields>
        {fields.map((field) => {
          return (
            <AcademicDisciplineTextField
              inputMin={field.inputMin}
              inputStep={field.inputStep}
              key={field.label}
              label={field.label}
              onChange={field.onChange}
              type={field.type}
              value={field.value}
            />
          );
        })}
      </UIResponsiveFields>
      <UIButton disabled={!props.form.name.trim()} onClick={props.form.onSave} variant="contained">
        {t("academic.save")}
      </UIButton>
    </UIContentGroup>
  );
}
