import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalKnowledgeViewsSection } from "./personal-knowledge-views-section.component";
import { PersonalProgressSection } from "./personal-progress-section.component";
import { PersonalWorkspaceRelationActions } from "./personal-workspace-relation-actions.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceAdvancedDisclosuresProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceAdvancedDisclosures(
  props: PersonalWorkspaceAdvancedDisclosuresProps,
) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">{t("personal.moreTools")}</UITypography>
      <PersonalWorkspaceRelationActions selection={props.selection} viewModel={props.viewModel} />
      <UIContentGroup variant="content">
        <UITypography variant="h5">{t("personal.knowledgeViews")}</UITypography>
        <PersonalKnowledgeViewsSection
          onDeleteLens={props.viewModel.deleteLens}
          onSaveLens={props.viewModel.saveLens}
          selection={props.selection}
          workspace={props.viewModel.workspace}
        />
      </UIContentGroup>
      <UIContentGroup variant="content">
        <UITypography variant="h5">{t("personal.progress.title")}</UITypography>
        <PersonalProgressSection progress={props.viewModel.progress} />
      </UIContentGroup>
    </UIContentGroup>
  );
}
