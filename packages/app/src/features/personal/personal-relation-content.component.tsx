import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { PersonalRelationEndpointStatus } from "./personal-relation-endpoint-status.component";
import type { PersonalRelationContentProps } from "./personal-relation-content-props.interface";
import type { ReactElement } from "react";

export function PersonalRelationContent(props: PersonalRelationContentProps): ReactElement {
  return (
    <UIContentGroup variant="content">
      <UITypography aria-label="Caminho da relação" color="text.secondary" variant="caption">
        Meu espaço / Relações / {props.relation.kind}
      </UITypography>
      <UITypography variant="subtitle1">{props.relation.kind}</UITypography>
      <UITypography color="text.secondary" variant="body2">
        {props.relation.source.recordType}:{props.relation.source.id} → {props.relation.target.recordType}:
        {props.relation.target.id}
      </UITypography>
      <PersonalRelationEndpointStatus availability={props.sourceAvailability} />
      <PersonalRelationEndpointStatus availability={props.targetAvailability} />
      <UIInlineActions stacked>
        <UIButton onClick={props.onOpenOrigin} variant="text">
          Abrir origem
        </UIButton>
        <UIButton onClick={props.onOpenTarget} variant="text">
          Abrir destino
        </UIButton>
        <UIButton onClick={props.handleAction} variant="text">
          {props.actionLabel}
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
