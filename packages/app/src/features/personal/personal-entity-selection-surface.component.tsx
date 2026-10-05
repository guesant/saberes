import { UISelectableSurface } from "@guesant/saberes-ui";
import { selectPersonalEntityOnKeyDown } from "./select-personal-entity-on-key-down.function";
import type { PersonalEntitySelectionSurfaceProps } from "./personal-entity-selection-surface-props.interface";
import type { ReactElement } from "react";

export function PersonalEntitySelectionSurface(
  props: PersonalEntitySelectionSurfaceProps,
): ReactElement {
  return (
    <UISelectableSurface
      aria-current={props.selected ? "true" : undefined}
      aria-label={props.ariaLabel}
      id={props.id}
      interactive
      onClick={() => { props.onSelect(props.endpoint); }}
      onKeyDown={(event) => {
        selectPersonalEntityOnKeyDown(event, props.endpoint, props.onSelect);
      }}
      selected={props.selected}
    >
      {props.children}
    </UISelectableSurface>
  );
}
