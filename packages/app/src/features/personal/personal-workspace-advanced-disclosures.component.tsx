import { UIDisclosure } from "@guesant/saberes-ui";
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
    <UIDisclosure summary={t("personal.moreTools")}>
      <PersonalWorkspaceRelationActions selection={props.selection} viewModel={props.viewModel} />
      <UIDisclosure summary={t("personal.knowledgeViews")}>
        <PersonalKnowledgeViewsSection
          onDeleteLens={props.viewModel.deleteLens}
          onSaveLens={props.viewModel.saveLens}
          selection={props.selection}
          workspace={props.viewModel.workspace}
        />
      </UIDisclosure>
      <UIDisclosure summary={t("personal.progress.title")}>
        <PersonalProgressSection progress={props.viewModel.progress} />
      </UIDisclosure>
    </UIDisclosure>
  );
}
