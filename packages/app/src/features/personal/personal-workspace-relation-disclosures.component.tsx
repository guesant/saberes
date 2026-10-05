import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalBacklinksSection } from "./personal-backlinks-section.component";
import { PersonalRelationsSection } from "./personal-relations-section.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceRelationDisclosuresProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceRelationDisclosures(
  props: PersonalWorkspaceRelationDisclosuresProps,
) {
  const { t } = useTranslation();

  return (
    <>
      <UIDisclosure summary={t("personal.relations")}>
        <PersonalRelationsSection
          onArchive={props.viewModel.archiveRelation}
          onCreate={props.viewModel.createRelation}
          onRestore={props.viewModel.restoreRelation}
          relations={props.viewModel.workspace.relations ?? []}
          selection={props.selection}
          workspace={props.viewModel.workspace}
        />
      </UIDisclosure>
      <UIDisclosure summary={t("personal.backlinks")}>
        <PersonalBacklinksSection
          onArchive={props.viewModel.archiveRelation}
          onRestore={props.viewModel.restoreRelation}
          relations={props.viewModel.workspace.relations ?? []}
          selection={props.selection}
          workspace={props.viewModel.workspace}
        />
      </UIDisclosure>
    </>
  );
}
