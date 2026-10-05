import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { AcademicDisciplineCreateDialog } from "./academic-discipline-create-dialog.component";
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
      <AcademicDisciplineCreateDialog
        onSave={props.viewModel.save}
        title={t("academic.newDiscipline")}
        triggerLabel={t("academic.newDiscipline")}
      />
      <AcademicSaveError error={props.viewModel.saveError} />
      <AcademicDisciplineList
        disciplines={props.viewModel.disciplines}
        metrics={props.viewModel.metrics}
        onRemove={props.viewModel.remove}
        onSave={props.viewModel.save}
      />
    </UIContentGroup>
  );
}
