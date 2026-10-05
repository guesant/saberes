import { UIChip, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import type { PersonalKnowledgeNodeCardProps } from "./personal-knowledge-node-card-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeNodeCard(props: PersonalKnowledgeNodeCardProps): ReactElement {
  return (
    <PersonalEntitySelectionSurface
      ariaLabel={`Selecionar ${props.node.title}`}
      endpoint={props.node}
      onSelect={props.onSelect}
      selected={props.selected}
    >
      <UIContentGroup variant="content">
        <UIContentGroup variant="inline">
          <UITypography variant="subtitle1">{props.node.title}</UITypography>
          <UIChip label={props.node.recordType} size="small" />
        </UIContentGroup>
        <UITypography color="text.secondary" variant="body2">
          {props.node.archived ? "Arquivado localmente" : "Ativo localmente"}
        </UITypography>
      </UIContentGroup>
    </PersonalEntitySelectionSurface>
  );
}
