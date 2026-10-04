import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { PersonalArchivedList } from "./personal-archived-list.component";
import { PersonalReferenceItem } from "./personal-reference-item.component";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface PersonalReferencesSectionProps {
  workspace: PersonalWorkspace;
  onUpdateFavorite(id: string): Promise<void>;

  onDelete(id: string): Promise<void>;

  onUpdateContent(id: string, title: string, source: string): Promise<void>;

  onRestore(id: string): Promise<void>;
}

export function PersonalReferencesSection(props: PersonalReferencesSectionProps) {
  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">Referências</UITypography>
      <UIList>
        {props.workspace.references
          .filter((reference) => {
            return !reference.archived;
          })
          .map((reference) => {
            return (
              <PersonalReferenceItem
                key={reference.id}
                onUpdateFavorite={props.onUpdateFavorite}
                onDelete={props.onDelete}
                onUpdateContent={props.onUpdateContent}
                reference={reference}
              />
            );
          })}
      </UIList>
      {props.workspace.references.some((reference) => {
        return reference.archived;
      }) ? (
          <PersonalArchivedList
            items={props.workspace.references.filter((reference) => {
              return reference.archived;
            })}
            onRestore={props.onRestore}
            title="Arquivadas"
          />
        ) : null}
    </UIContentGroup>
  );
}
