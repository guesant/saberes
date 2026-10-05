import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalKnowledgeNodeCard } from "./personal-knowledge-node-card.component";
import type { PersonalKnowledgeBoardColumnProps } from "./personal-knowledge-board-column-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeBoardColumn(props: PersonalKnowledgeBoardColumnProps): ReactElement {
  return (
    <UIContentGroup variant="content">
      <UITypography variant="subtitle1">{props.recordType}</UITypography>
      {props.nodes.map((node) => {
        return (
          <PersonalKnowledgeNodeCard
            key={`${node.recordType}:${node.id}`}
            node={node}
            onSelect={props.selection.select}
            selected={props.selection.isSelected(node)}
          />
        );
      })}
    </UIContentGroup>
  );
}
