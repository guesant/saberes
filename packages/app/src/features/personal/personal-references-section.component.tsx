import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { getPersonalReferencesByArchiveState } from "./get-personal-references-by-archive-state.function";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { PersonalReferenceItem } from "./personal-reference-item.component";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalReferencesSectionProps {
  selection: PersonalEntitySelection;
  workspace: PersonalWorkspace;
  onUpdateFavorite(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(id: string, title: string, source: string): Promise<void>;

  onRestore(id: string): Promise<void>;
}

export function PersonalReferencesSection(props: PersonalReferencesSectionProps) {
  const activeReferences = getPersonalReferencesByArchiveState(props.workspace.references, false);

  const archivedReferences = getPersonalReferencesByArchiveState(props.workspace.references, true);

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Referências</UITypography>
      <UIList>
        {activeReferences.map((reference) => {
          return (
            <PersonalReferenceItem
              key={reference.id}
              onUpdateFavorite={props.onUpdateFavorite}
              onDelete={props.onDelete}
              onUpdateContent={props.onUpdateContent}
              selection={props.selection}
              reference={reference}
            />
          );
        })}
      </UIList>
      {archivedReferences.length > 0 ? (
        <PersonalArchivedList
          items={archivedReferences}
          onRestore={props.onRestore}
          title="Arquivadas"
        />
      ) : null}
    </UIContentGroup>
  );
}
