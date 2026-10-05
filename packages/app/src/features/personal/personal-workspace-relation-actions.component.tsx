import { UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalBacklinksDialog } from "./personal-backlinks-dialog.component";
import { PersonalRelationsDialog } from "./personal-relations-dialog.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceRelationActionsProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceRelationActions(props: PersonalWorkspaceRelationActionsProps) {
  const { t } = useTranslation();

  const relations = props.viewModel.workspace.relations ?? [];

  return (
    <UIInlineActions wrap>
      <PersonalRelationsDialog
        onArchive={props.viewModel.archiveRelation}
        onCreate={props.viewModel.createRelation}
        onRestore={props.viewModel.restoreRelation}
        relations={relations}
        selection={props.selection}
        title={t("personal.relations")}
        triggerLabel={t("personal.relations")}
        workspace={props.viewModel.workspace}
      />
      <PersonalBacklinksDialog
        onArchive={props.viewModel.archiveRelation}
        onRestore={props.viewModel.restoreRelation}
        relations={relations}
        selection={props.selection}
        title={t("personal.backlinks")}
        triggerLabel={t("personal.backlinks")}
        workspace={props.viewModel.workspace}
      />
    </UIInlineActions>
  );
}
