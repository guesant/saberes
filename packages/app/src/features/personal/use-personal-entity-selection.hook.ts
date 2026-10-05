import { useState } from "react";
import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalRelationEndpoint } from "@guesant/saberes-application";

export function usePersonalEntitySelection(): PersonalEntitySelection {
  const [selected, setSelected] = useState<PersonalRelationEndpoint | undefined>(undefined);

  return {
    clear: (): void => { setSelected(undefined); },
    isSelected: (endpoint: PersonalRelationEndpoint): boolean => {
      return selected?.id === endpoint.id && selected.recordType === endpoint.recordType;
    },
    select: (endpoint: PersonalRelationEndpoint): void => { setSelected(endpoint); },
    selected,
  };
}
