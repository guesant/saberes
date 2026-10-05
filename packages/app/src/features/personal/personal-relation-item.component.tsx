import { useNavigate } from "react-router-dom";
import { getPersonalRelationEndpointAvailability } from "./get-personal-relation-endpoint-availability.function";
import { getPersonalRelationEndpointPath } from "./get-personal-relation-endpoint-path.function";
import { PersonalEntitySelectionSurface } from "./personal-entity-selection-surface.component";
import { PersonalRelationContent } from "./personal-relation-content.component";
import type { PersonalRelationItemProps } from "./personal-relation-item-props.interface";

export function PersonalRelationItem(props: PersonalRelationItemProps) {
  const navigate = useNavigate();

  const actionLabel = props.relation.archived ? "Restaurar vínculo" : "Desvincular";

  const handleAction = props.relation.archived
    ? () => {return props.onRestore(props.relation.id);}
    : () => {return props.onArchive(props.relation.id);};

  const openOrigin = () => {
    props.selection.select(props.relation.source);

    return navigate(getPersonalRelationEndpointPath(props.relation.source));
  };

  const openTarget = () => {
    props.selection.select(props.relation.target);

    return navigate(getPersonalRelationEndpointPath(props.relation.target));
  };

  const selected = props.selection.isSelected(props.relation.source) ||
    props.selection.isSelected(props.relation.target);

  return (
    <PersonalEntitySelectionSurface
      ariaLabel={`Selecionar relação ${props.relation.kind}`}
      endpoint={props.relation.source}
      onSelect={props.selection.select}
      selected={selected}
    >
      <PersonalRelationContent
        actionLabel={actionLabel}
        handleAction={handleAction}
        onOpenOrigin={openOrigin}
        onOpenTarget={openTarget}
        relation={props.relation}
        sourceAvailability={getPersonalRelationEndpointAvailability(props.workspace, props.relation.source)}
        targetAvailability={getPersonalRelationEndpointAvailability(props.workspace, props.relation.target)}
      />
    </PersonalEntitySelectionSurface>
  );
}
