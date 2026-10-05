import { UIWrappedTypography } from "@guesant/saberes-ui";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import type { PersonalKnowledgeRelationRowProps } from "./personal-knowledge-relation-row-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeRelationRow(props: PersonalKnowledgeRelationRowProps): ReactElement {
  return (
    <PersonalEntitySelectionSurface
      ariaLabel={`Selecionar relação ${props.relation.kind}`}
      endpoint={props.relation.source}
      onSelect={props.selection.select}
      selected={props.selection.isSelected(props.relation.source)}
    >
      <UIWrappedTypography color="text.secondary" variant="body2">
        {props.relation.source.recordType}:{props.relation.source.id} → {props.relation.target.recordType}:
        {props.relation.target.id}
      </UIWrappedTypography>
    </PersonalEntitySelectionSurface>
  );
}
