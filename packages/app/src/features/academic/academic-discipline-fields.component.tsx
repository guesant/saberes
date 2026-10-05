import { UIButton, UIContentGroup, UIDisclosure, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineFieldsList } from "./academic-discipline-fields-list.component";
import { createAcademicDisciplineCoreTextFields } from "./create-academic-discipline-core-text-fields.function";
import { createAcademicDisciplineGradeTextFields } from "./create-academic-discipline-grade-text-fields.function";
import type { AcademicDisciplineFormState } from "./academic-discipline-form-state.interface";

export interface AcademicDisciplineFieldsProps {
  form: AcademicDisciplineFormState;
}

export function AcademicDisciplineFields(props: AcademicDisciplineFieldsProps) {
  const { t } = useTranslation();

  const coreFields = createAcademicDisciplineCoreTextFields(props.form, t);

  const gradeFields = createAcademicDisciplineGradeTextFields(props.form, t);

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{t("academic.newDiscipline")}</UITypography>
      <AcademicDisciplineFieldsList fields={coreFields} />
      <UIDisclosure summary={t("academic.gradeDetails")}>
        <AcademicDisciplineFieldsList fields={gradeFields} />
      </UIDisclosure>
      <UIButton disabled={!props.form.name.trim()} onClick={props.form.onSave} variant="contained">
        {t("academic.save")}
      </UIButton>
    </UIContentGroup>
  );
}
