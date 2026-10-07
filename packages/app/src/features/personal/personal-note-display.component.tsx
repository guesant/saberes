import { getContentReferenceKey } from "@guesant/saberes-application";
import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import { PersonalRelatedContent } from "./personal-related-content.component";
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
  const { t } = useTranslation();

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
        {getContentReferenceKey(props.note.contentReference) ? (
          <PersonalRelatedContent value={getContentReferenceKey(props.note.contentReference) || ""} />
        ) : null}
        <UIInlineActions stacked>
          <UIButton onClick={props.onArchive} variant="text">
            {t("personal.capture.archive")}
          </UIButton>
          <UIButton onClick={props.onEdit} variant="text">
            {t("personal.capture.edit")}
          </UIButton>
          <UIButton onClick={props.onDelete} variant="text">
            {t("personal.capture.delete")}
          </UIButton>
        </UIInlineActions>
      </UIContentGroup>
    </PersonalEntitySelectionSurface>
  );
}
