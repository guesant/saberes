import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { PersonalNoteItem } from "./personal-note-item.component";
import type { UpdatePersonalNoteContentActionInput } from "./update-personal-note-content-action-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalNotesSectionProps {
  workspace: PersonalWorkspace;
  onUpdate(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(input: UpdatePersonalNoteContentActionInput): Promise<void>;

  onRestore(id: string): Promise<void>;
}

export function PersonalNotesSection(props: PersonalNotesSectionProps) {
  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Notas</UITypography>
      <UIList>
        {props.workspace.notes
          .filter((note) => !note.archived)
          .map((note) => (
            <PersonalNoteItem
              key={note.id}
              note={note}
              onDelete={props.onDelete}
              onUpdateContent={props.onUpdateContent}
              onUpdate={props.onUpdate}
            />
          ))}
      </UIList>
      {props.workspace.notes.some((note) => note.archived) ? (
        <PersonalArchivedList
          items={props.workspace.notes.filter((note) => note.archived)}
          onRestore={props.onRestore}
          title="Arquivadas"
        />
      ) : null}
    </UIContentGroup>
  );
}
