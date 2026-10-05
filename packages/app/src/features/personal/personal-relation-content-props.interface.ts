import type { PersonalRelationEndpointAvailability } from "./personal-relation-endpoint-availability.type";
import type { PersonalRelation } from "@guesant/saberes-application";

export interface PersonalRelationContentProps {
  actionLabel: string;
  handleAction(): Promise<void>;

  onOpenOrigin(): void;

  onOpenTarget(): void;
  relation: PersonalRelation;
  sourceAvailability: PersonalRelationEndpointAvailability;
  targetAvailability: PersonalRelationEndpointAvailability;
}
