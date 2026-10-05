import { UIContentGroup, UIDisclosure, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineForm } from "./academic-discipline-form.component";
import { AcademicDisciplineList } from "./academic-discipline-list.component";
import { AcademicSaveError } from "./academic-save-error.component";
import type { AcademicViewModel } from "./academic.view-model";

export interface AcademicReadyViewProps {
  viewModel: AcademicViewModel;
}

export function AcademicReadyView(props: AcademicReadyViewProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("academic.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("academic.title")}</UITypography>
        <UITypography color="text.secondary">{t("academic.description")}</UITypography>
      </UIContentGroup>
      <UIDisclosure summary={t("academic.newDiscipline")}>
        <AcademicDisciplineForm onSave={props.viewModel.save} />
      </UIDisclosure>
      <AcademicSaveError error={props.viewModel.saveError} />
      <AcademicDisciplineList
        disciplines={props.viewModel.disciplines}
        metrics={props.viewModel.metrics}
        onRemove={props.viewModel.remove}
      />
    </UIContentGroup>
  );
}
