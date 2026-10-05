import { UIContentGroup } from "@guesant/saberes-ui";
import { PersonalWorkspaceEmptyState } from "./personal-workspace-empty-state.component";
import { PersonalWorkspaceHeaderSection } from "./personal-workspace-header-section.component";
import { PersonalWorkspaceRecordSections } from "./personal-workspace-record-sections.component";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceReadyViewProps {
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceReadyView(props: PersonalWorkspaceReadyViewProps) {
  return (
    <UIContentGroup variant="section">
      <PersonalWorkspaceHeaderSection viewModel={props.viewModel} />
      {props.viewModel.workspace.notes.length > 0 ||
      props.viewModel.workspace.checklists.length > 0 ||
      props.viewModel.workspace.captures.length > 0 ||
      props.viewModel.workspace.references.length > 0 ? (
          <PersonalWorkspaceRecordSections viewModel={props.viewModel} />
        ) : (
          <PersonalWorkspaceEmptyState />
        )}
    </UIContentGroup>
  );
}
