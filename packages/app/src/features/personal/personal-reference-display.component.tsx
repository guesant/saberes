import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { PersonalReferenceSource } from "./personal-reference-source.component";
import type { PersonalReference } from "@guesant/saberes-application";

export interface PersonalReferenceDisplayProps {
  reference: PersonalReference;
  onFavorite(): Promise<void>;

  onDelete(): Promise<void>;

  onEdit(): void;
}

export function PersonalReferenceDisplay(props: PersonalReferenceDisplayProps) {
  return (
    <UIContentGroup id={`personal-reference-${props.reference.id}`} variant="content">
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
  );
}
