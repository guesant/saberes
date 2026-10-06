import { UIBox } from "./box.component";
import type { UIStaticSelectableSurfaceProps } from "./ui-static-selectable-surface-props.interface";
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
};

export function UIStaticSelectableSurface(props: UIStaticSelectableSurfaceProps): ReactElement {
  return (
    <UIBox
      align="stretch"
      aria-current={props["aria-current"]}
      aria-label={props["aria-label"]}
      className={props.selected ? "UISelectableSurface-selected" : undefined}
      component="article"
      id={props.id}
      inset="md"
      layout="column"
      sx={selectableSurfaceSx}
    >
      {props.children}
    </UIBox>
  );
}
