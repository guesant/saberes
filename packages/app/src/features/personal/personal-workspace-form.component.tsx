import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalBacklinksSection } from "./personal-backlinks-section.component";
import { PersonalKnowledgeViewsSection } from "./personal-knowledge-views-section.component";
import { PersonalNoteCreate } from "./personal-note-create.component";
import { PersonalProgressSection } from "./personal-progress-section.component";
import { PersonalReferenceCreate } from "./personal-reference-create.component";
import { PersonalRelationsSection } from "./personal-relations-section.component";
import { StudyCaptureCreate } from "./study-capture-create.component";
import { StudyChecklistCreate } from "./study-checklist-create.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceFormProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceForm(props: PersonalWorkspaceFormProps) {
  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Criar algo local</UITypography>
      <PersonalNoteCreate onCreate={props.viewModel.createNote} />
      <StudyChecklistCreate onCreate={props.viewModel.createChecklist} />
      <StudyCaptureCreate onCreate={props.viewModel.createCapture} />
      <PersonalReferenceCreate onCreate={props.viewModel.createReference} />
      <PersonalRelationsSection
        onArchive={props.viewModel.archiveRelation}
        onCreate={props.viewModel.createRelation}
        onRestore={props.viewModel.restoreRelation}
        relations={props.viewModel.workspace.relations ?? []}
        selection={props.selection}
        workspace={props.viewModel.workspace}
      />
      <PersonalBacklinksSection
        onArchive={props.viewModel.archiveRelation}
        onRestore={props.viewModel.restoreRelation}
        relations={props.viewModel.workspace.relations ?? []}
        selection={props.selection}
        workspace={props.viewModel.workspace}
      />
      <PersonalKnowledgeViewsSection
        onSaveLens={props.viewModel.saveLens}
        selection={props.selection}
        workspace={props.viewModel.workspace}
      />
      <PersonalProgressSection progress={props.viewModel.progress} />
    </UIContentGroup>
  );
}
