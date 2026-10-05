import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import type { PersonalNote, PersonalRelationEndpoint } from "@guesant/saberes-application";

export interface PersonalNoteDisplayProps {
  onSelect(endpoint: PersonalRelationEndpoint): void;

  selected: boolean;
  note: PersonalNote;
  onArchive(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function PersonalNoteDisplay(props: PersonalNoteDisplayProps) {
  return (
    <PersonalEntitySelectionSurface
      ariaLabel={`Selecionar ${props.note.title}`}
      endpoint={{ id: props.note.id, recordType: "note" }}
      id={`personal-note-${props.note.id}`}
      onSelect={props.onSelect}
      selected={props.selected}
    >
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
    </PersonalEntitySelectionSurface>
  );
}
