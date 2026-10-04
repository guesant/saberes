import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";
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
    <UIContentGroup variant="tight">
      <UITypography variant="h6">{props.checklist.title}</UITypography>
      <UITypography color="text.secondary">
        {props.checklist.items.length} itens locais para acompanhar
      </UITypography>
      {props.checklist.items.map((item, index) => (
        <StudyChecklistEntry
          canMoveDown={index < props.checklist.items.length - 1}
          canMoveUp={index > 0}
          key={item.id}
          label={item.label}
          onMoveDown={() => props.onMoveItem(props.checklist.id, item.id, "down")}
          onMoveUp={() => props.onMoveItem(props.checklist.id, item.id, "up")}
          onUpdate={() => props.onUpdateItem(props.checklist.id, item.id)}
        />
      ))}
      <UIButton onClick={props.onDelete} variant="text">
        Excluir checklist
      </UIButton>
      <UIButton onClick={props.onEdit} variant="text">
        Editar checklist
      </UIButton>
    </UIContentGroup>
  );
}
