import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { getPersonalNotesByArchiveState } from "./get-personal-notes-by-archive-state.function";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { PersonalNoteItem } from "./personal-note-item.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalNotesSectionProps {
  selection: PersonalEntitySelection;
  workspace: PersonalWorkspace;
  onUpdate(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: UpdatePersonalNoteContentActionInput): Promise<void>;

  onRestore(id: string): Promise<void>;
}

export function PersonalNotesSection(props: PersonalNotesSectionProps) {
  const activeNotes = getPersonalNotesByArchiveState(props.workspace.notes, false);

  const archivedNotes = getPersonalNotesByArchiveState(props.workspace.notes, true);

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Notas</UITypography>
      <UIList>
        {activeNotes.map((note) => {
          return (
            <PersonalNoteItem
              key={note.id}
              note={note}
              onDelete={props.onDelete}
              onUpdateContent={props.onUpdateContent}
              onUpdate={props.onUpdate}
              selection={props.selection}
            />
          );
        })}
      </UIList>
      {archivedNotes.length > 0 ? (
        <PersonalArchivedList
          items={archivedNotes}
          onRestore={props.onRestore}
          title="Arquivadas"
        />
      ) : null}
    </UIContentGroup>
  );
}
