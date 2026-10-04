import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalNoteCreate } from "./personal-note-create.component";
import { PersonalReferenceCreate } from "./personal-reference-create.component";
import { StudyCaptureCreate } from "./study-capture-create.component";
import { StudyChecklistCreate } from "./study-checklist-create.component";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceFormProps {
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
    </UIContentGroup>
  );
}
