import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalWorkspaceAdvancedDisclosures } from "./personal-workspace-advanced-disclosures.component";
import { PersonalWorkspaceCreationActions } from "./personal-workspace-creation-actions.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceFormProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceForm(props: PersonalWorkspaceFormProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">{t("personal.createSection")}</UITypography>
      <PersonalWorkspaceCreationActions viewModel={props.viewModel} />
      <PersonalWorkspaceAdvancedDisclosures selection={props.selection} viewModel={props.viewModel} />
    </UIContentGroup>
  );
}
