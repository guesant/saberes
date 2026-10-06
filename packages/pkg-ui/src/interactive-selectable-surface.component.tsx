import { UIBox } from "./box.component";
import type { UIInteractiveSelectableSurfaceProps } from "./ui-interactive-selectable-surface-props.interface";
import type { ReactElement } from "react";

const selectableSurfaceSx = {
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "0.25rem",
  boxShadow: "none",
  outline: "none",
  textAlign: "left" as const,
  width: "100%",
  "&.UISelectableSurface-selected": { borderColor: "primary.main" },
  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
};

export function UIInteractiveSelectableSurface(props: UIInteractiveSelectableSurfaceProps): ReactElement {
  return (
    <UIBox
      align="stretch"
      aria-current={props["aria-current"]}
      aria-label={props["aria-label"]}
      aria-pressed={props["aria-pressed"]}
      className={props.selected ? "UISelectableSurface-selected" : undefined}
      component="button"
      disabled={props.disabled}
      id={props.id}
      inset="md"
      layout="column"
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      sx={{ ...selectableSurfaceSx, cursor: "pointer" }}
      type="button"
    >
      {props.children}
    </UIBox>
  );
}
