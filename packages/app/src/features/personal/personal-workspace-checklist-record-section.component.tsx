import { PersonalChecklistsSection } from "./personal-checklists-section.component";
import type { PersonalWorkspaceViewModel } from "./personal-workspace-view-model.interface";

export interface PersonalWorkspaceChecklistRecordSectionProps {
  viewModel: PersonalWorkspaceViewModel;
}

export function PersonalWorkspaceChecklistRecordSection(
  props: PersonalWorkspaceChecklistRecordSectionProps,
) {
  return (
    <PersonalChecklistsSection
      onDelete={props.viewModel.deleteChecklist}
      onMoveItem={props.viewModel.moveChecklistItem}
      onUpdateContent={props.viewModel.updateChecklistContent}
      onUpdateItem={props.viewModel.updateChecklistItem}
      onRestore={props.viewModel.restoreChecklist}
      workspace={props.viewModel.workspace}
    />
  );
}
