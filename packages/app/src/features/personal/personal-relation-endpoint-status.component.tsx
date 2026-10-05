import { UITypography } from "@guesant/saberes-ui";
import { getPersonalRelationEndpointStatusLabel } from "./get-personal-relation-endpoint-status-label.function";
import type { PersonalRelationEndpointStatusProps } from "./personal-relation-endpoint-status-props.interface";

export function PersonalRelationEndpointStatus(props: PersonalRelationEndpointStatusProps) {
  const label = getPersonalRelationEndpointStatusLabel(props.availability);

  if (!label) {
    return null;
  }

  return <UITypography color="warning.main" variant="caption">{label}</UITypography>;
}
