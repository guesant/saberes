import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import { PersonalReferenceSource } from "./personal-reference-source.component";
import type { PersonalReference , PersonalRelationEndpoint } from "@guesant/saberes-application";

export interface PersonalReferenceDisplayProps {
  onSelect(endpoint: PersonalRelationEndpoint): void;

  selected: boolean;
  reference: PersonalReference;
  onFavorite(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function PersonalReferenceDisplay(props: PersonalReferenceDisplayProps) {
  return (
    <PersonalEntitySelectionSurface
      ariaLabel={`Selecionar ${props.reference.title}`}
      endpoint={{ id: props.reference.id, recordType: "reference" }}
      id={`personal-reference-${props.reference.id}`}
      onSelect={props.onSelect}
      selected={props.selected}
    >
      <UIContentGroup variant="content">
        <UITypography variant="h6">{props.reference.title}</UITypography>
        <PersonalReferenceSource reference={props.reference} />
        <UIInlineActions>
          <UIButton onClick={props.onFavorite} variant="text">
            {props.reference.favorite ? "Remover favorito" : "Favoritar"}
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
