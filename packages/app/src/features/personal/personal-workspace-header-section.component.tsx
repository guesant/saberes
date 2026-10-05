import { UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalWorkspaceForm } from "./personal-workspace-form.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceHeaderSectionProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceHeaderSection(props: PersonalWorkspaceHeaderSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <UITypography variant="overline">{t("personal.eyebrow")}</UITypography>
      <UITypography variant="h3">{t("personal.title")}</UITypography>
      <UITypography color="text.secondary">
        {t("personal.description")}
      </UITypography>
      <PersonalWorkspaceForm selection={props.selection} viewModel={props.viewModel} />
    </>
  );
}
