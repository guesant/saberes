import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { PersonalKnowledgeBoardColumn } from "./personal-knowledge-board-column.component";
import type { PersonalKnowledgeBoardViewProps } from "./personal-knowledge-board-view-props.interface";
import type { ReactElement } from "react";

const boardRecordTypes = ["note", "checklist", "capture", "reference"];

export function PersonalKnowledgeBoardView(props: PersonalKnowledgeBoardViewProps): ReactElement {
  return (
    <UIContentGroup variant="content">
      <UITypography variant="subtitle1">Board pessoal</UITypography>
      <UITypography color="text.secondary" variant="body2">
        A mesma fonte local é agrupada por tipo para facilitar a leitura e a retomada.
      </UITypography>
      <UIContentGroup variant="content">
        {boardRecordTypes.map((recordType) => {
          return (
            <PersonalKnowledgeBoardColumn
              key={recordType}
              nodes={props.projection.nodes.filter((node) => { return node.recordType === recordType; })}
              recordType={recordType}
            />
          );
        })}
      </UIContentGroup>
    </UIContentGroup>
  );
}
