import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { StudyChecklistViewItem } from "./study-checklist-view-item.component";
import type { UpdateStudyChecklistContentActionInput } from "./update-study-checklist-content-action-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalChecklistsSectionProps {
  workspace: PersonalWorkspace;
  onUpdateItem(checklistId: string, itemId: string): Promise<void>;

  onMoveItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  onUpdateContent(input: UpdateStudyChecklistContentActionInput): Promise<void>;

  onDelete(id: string): Promise<void>;

  onRestore(id: string): Promise<void>;
}

export function PersonalChecklistsSection(props: PersonalChecklistsSectionProps) {
  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Checklists</UITypography>
      <UIList>
        {props.workspace.checklists
          .filter((checklist) => !checklist.archived)
          .map((checklist) => (
            <StudyChecklistViewItem
              checklist={checklist}
              key={checklist.id}
              onDelete={props.onDelete}
              onMoveItem={props.onMoveItem}
              onUpdateContent={props.onUpdateContent}
              onUpdateItem={props.onUpdateItem}
            />
          ))}
      </UIList>
      {props.workspace.checklists.some((checklist) => checklist.archived) ? (
        <PersonalArchivedList
          items={props.workspace.checklists.filter((checklist) => checklist.archived)}
          onRestore={props.onRestore}
          title="Arquivados"
        />
      ) : null}
    </UIContentGroup>
  );
}
