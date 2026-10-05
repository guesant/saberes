import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import type { PersonalNote } from "@guesant/saberes-application";

export interface PersonalNoteDisplayProps {
  note: PersonalNote;
  onArchive(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function PersonalNoteDisplay(props: PersonalNoteDisplayProps) {
  return (
    <UIContentGroup variant="content">
      <UITypography variant="h6">{props.note.title}</UITypography>
      <UITypography color="text.secondary">{props.note.body}</UITypography>
      <UITypography>{props.note.contentKey ?? "Sem ContentKey"}</UITypography>
      <UIInlineActions>
        <UIButton onClick={props.onArchive} variant="text">
          Arquivar
        </UIButton>
        <UIButton onClick={props.onEdit} variant="text">
          Editar
        </UIButton>
        <UIButton onClick={props.onDelete} variant="text">
          Excluir
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
