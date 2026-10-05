import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalRelationEndpoint } from "@guesant/saberes-application";
import type { KeyboardEvent } from "react";

export function selectPersonalEntityOnKeyDown(
  event: KeyboardEvent<HTMLElement>,
  endpoint: PersonalRelationEndpoint,
  onSelect: PersonalEntitySelection["select"],
): void {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();

    onSelect(endpoint);
  }
}
