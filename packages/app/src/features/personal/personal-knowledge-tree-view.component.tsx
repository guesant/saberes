import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalKnowledgeNodeCard } from "./personal-knowledge-node-card.component";
import { PersonalKnowledgeRelationRow } from "./personal-knowledge-relation-row.component";
import type { PersonalKnowledgeTreeViewProps } from "./personal-knowledge-tree-view-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeTreeView(props: PersonalKnowledgeTreeViewProps): ReactElement {
  return (
    <UIContentGroup variant="content">
      <UITypography variant="subtitle1">Árvore pessoal</UITypography>
      <UITypography color="text.secondary" variant="body2">
        Os registros aparecem em uma única fonte local; as relações indicam como cada item se conecta.
      </UITypography>
      {props.projection.nodes.map((node) => {
        return <PersonalKnowledgeNodeCard key={`${node.recordType}:${node.id}`} node={node} />;
      })}
      {props.projection.relations.map((relation) => {
        return <PersonalKnowledgeRelationRow key={relation.id} relation={relation} />;
      })}
    </UIContentGroup>
  );
}
