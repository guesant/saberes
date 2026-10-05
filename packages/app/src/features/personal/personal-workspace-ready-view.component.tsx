import { UIContentGroup } from "@guesant/saberes-ui";
import { hasPersonalWorkspaceRecords } from "./has-personal-workspace-records.function";
import { PersonalWorkspaceEmptyState } from "./personal-workspace-empty-state.component";
import { PersonalWorkspaceHeaderSection } from "./personal-workspace-header-section.component";
import { PersonalWorkspaceRecordSections } from "./personal-workspace-record-sections.component";
import { usePersonalEntitySelection } from "./use-personal-entity-selection.hook";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceReadyViewProps {
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceReadyView(props: PersonalWorkspaceReadyViewProps) {
  const selection = usePersonalEntitySelection();

  return (
    <UIContentGroup variant="section">
      <PersonalWorkspaceHeaderSection selection={selection} viewModel={props.viewModel} />
      {hasPersonalWorkspaceRecords(props.viewModel.workspace) ? (
        <PersonalWorkspaceRecordSections selection={selection} viewModel={props.viewModel} />
      ) : (
        <PersonalWorkspaceEmptyState />
      )}
    </UIContentGroup>
  );
}
