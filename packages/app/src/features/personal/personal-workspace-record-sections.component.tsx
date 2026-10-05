import { PersonalCapturesSection } from "./personal-captures-section.component";
import { PersonalNotesSection } from "./personal-notes-section.component";
import { PersonalReferencesSection } from "./personal-references-section.component";
import { PersonalWorkspaceChecklistRecordSection } from "./personal-workspace-checklist-record-section.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceRecordSectionsProps {
  selection: PersonalEntitySelection;
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceRecordSections(props: PersonalWorkspaceRecordSectionsProps) {
  return (
    <>
      <PersonalNotesSection
        onDelete={props.viewModel.deleteNote}
        onUpdate={props.viewModel.updateNote}
        onUpdateContent={props.viewModel.updateNoteContent}
        onRestore={props.viewModel.restoreNote}
        selection={props.selection}
        workspace={props.viewModel.workspace}
      />
      <PersonalWorkspaceChecklistRecordSection selection={props.selection} viewModel={props.viewModel} />
      <PersonalCapturesSection
        onDelete={props.viewModel.deleteCapture}
        onUpdateContent={props.viewModel.updateCaptureContent}
        onUpdateArchive={props.viewModel.updateCaptureArchive}
        onUpdateCompletion={props.viewModel.updateCaptureCompletion}
        selection={props.selection}
        workspace={props.viewModel.workspace}
        onRestore={props.viewModel.restoreCapture}
      />
      <PersonalReferencesSection
        onDelete={props.viewModel.deleteReference}
        onUpdateContent={props.viewModel.updateReferenceContent}
        onUpdateFavorite={props.viewModel.updateReferenceFavorite}
        selection={props.selection}
        workspace={props.viewModel.workspace}
        onRestore={props.viewModel.restoreReference}
      />
    </>
  );
}
