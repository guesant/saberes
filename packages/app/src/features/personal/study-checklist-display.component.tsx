import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import { StudyChecklistEntries } from "./study-checklist-entries.component";
import type { PersonalRelationEndpoint, StudyChecklist } from "@guesant/saberes-application";

export interface StudyChecklistDisplayProps {
  onSelect(endpoint: PersonalRelationEndpoint): void;

  selected: boolean;
  checklist: StudyChecklist;
  onUpdateItem(checklistId: string, itemId: string): Promise<void>;

  onMoveItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function StudyChecklistDisplay(props: StudyChecklistDisplayProps) {
  return (
    <PersonalEntitySelectionSurface
      ariaLabel={`Selecionar ${props.checklist.title}`}
      endpoint={{ id: props.checklist.id, recordType: "checklist" }}
      id={`personal-checklist-${props.checklist.id}`}
      onSelect={props.onSelect}
      selected={props.selected}
    >
      <UIContentGroup variant="content">
        <UITypography variant="h6">{props.checklist.title}</UITypography>
        <UITypography color="text.secondary">
          {props.checklist.items.length} itens locais para acompanhar
        </UITypography>
        <StudyChecklistEntries
          checklist={props.checklist}
          onMoveItem={props.onMoveItem}
          onUpdateItem={props.onUpdateItem}
        />
        <UIInlineActions stacked>
          <UIButton onClick={props.onDelete} variant="text">
            Excluir checklist
          </UIButton>
          <UIButton onClick={props.onEdit} variant="text">
            Editar checklist
          </UIButton>
        </UIInlineActions>
      </UIContentGroup>
    </PersonalEntitySelectionSurface>
  );
}
