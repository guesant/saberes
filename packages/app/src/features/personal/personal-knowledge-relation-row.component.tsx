import { UITypography } from "@guesant/saberes-ui";
import type { PersonalKnowledgeRelationRowProps } from "./personal-knowledge-relation-row-props.interface";
import type { ReactElement } from "react";

export function PersonalKnowledgeRelationRow(props: PersonalKnowledgeRelationRowProps): ReactElement {
  return (
    <UITypography color="text.secondary" variant="body2">
      {props.relation.source.recordType}:{props.relation.source.id} → {props.relation.target.recordType}:
      {props.relation.target.id}
    </UITypography>
  );
}
