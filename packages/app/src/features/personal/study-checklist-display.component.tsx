import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { StudyChecklistEntry } from "./study-checklist-entry.component";
import type { StudyChecklist } from "@guesant/saberes-application";

export interface StudyChecklistDisplayProps {
  checklist: StudyChecklist;
  onUpdateItem(checklistId: string, itemId: string): Promise<void>;

  onMoveItem(checklistId: string, itemId: string, direction: "down" | "up"): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function StudyChecklistDisplay(props: StudyChecklistDisplayProps) {
  return (
    <UIContentGroup id={`personal-checklist-${props.checklist.id}`} variant="content">
      <UITypography variant="h6">{props.checklist.title}</UITypography>
      <UITypography color="text.secondary">
        {props.checklist.items.length} itens locais para acompanhar
      </UITypography>
      {props.checklist.items.map((item, index) => {
        return (
          <StudyChecklistEntry
            canMoveDown={index < props.checklist.items.length - 1}
            canMoveUp={index > 0}
            key={item.id}
            label={item.label}
            onMoveDown={() => { return props.onMoveItem(props.checklist.id, item.id, "down"); }}
            onMoveUp={() => { return props.onMoveItem(props.checklist.id, item.id, "up"); }}
            onUpdate={() => { return props.onUpdateItem(props.checklist.id, item.id); }}
          />
        );
      })}
      <UIInlineActions>
        <UIButton onClick={props.onDelete} variant="text">
          Excluir checklist
        </UIButton>
        <UIButton onClick={props.onEdit} variant="text">
          Editar checklist
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
