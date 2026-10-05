import { UIButton, UIContentGroup, UIInlineActions, UITypography } from "@guesant/saberes-ui";
import { useNavigate } from "react-router-dom";
import { getPersonalRelationEndpointPath } from "./get-personal-relation-endpoint-path.function";
import type { PersonalRelationItemProps } from "./personal-relation-item-props.interface";

export function PersonalRelationItem(props: PersonalRelationItemProps) {
  const navigate = useNavigate();

  const actionLabel = props.relation.archived ? "Restaurar relação" : "Arquivar relação";

  const handleAction = props.relation.archived
    ? () => {return props.onRestore(props.relation.id);}
    : () => {return props.onArchive(props.relation.id);};

  return (
    <UIContentGroup variant="content">
      <UITypography variant="subtitle1">{props.relation.kind}</UITypography>
      <UITypography color="text.secondary" variant="body2">
        {props.relation.source.recordType}:{props.relation.source.id} → {props.relation.target.recordType}:
        {props.relation.target.id}
      </UITypography>
      <UIInlineActions>
        <UIButton
          onClick={() => { return navigate(getPersonalRelationEndpointPath(props.relation.source)); }}
          variant="text"
        >
          Abrir origem
        </UIButton>
        <UIButton onClick={handleAction} variant="text">
          {actionLabel}
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
