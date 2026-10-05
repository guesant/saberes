import type { PersonalRelationEndpoint } from "@guesant/saberes-application";
import type { ReactNode } from "react";

export interface PersonalEntitySelectionSurfaceProps {
  ariaLabel: string;
  children: ReactNode;
  endpoint: PersonalRelationEndpoint;
  id?: string;
  onSelect(endpoint: PersonalRelationEndpoint): void;
  selected: boolean;
}
