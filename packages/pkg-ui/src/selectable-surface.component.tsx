import { type ComponentPropsWithoutRef, type ElementType, type ReactElement, type ReactNode } from "react";
import { UIBox } from "./box.component";

export interface UISelectableSurfaceProps extends Pick<
  ComponentPropsWithoutRef<"button">,
  "aria-current" | "aria-label" | "aria-pressed" | "disabled" | "id" | "onClick" | "onKeyDown"
> {
  children?: ReactNode;
  interactive?: boolean;
  selected: boolean;
}

const selectableSurfaceSx = {
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "0.25rem",
  boxShadow: "none",
  outline: "none",
  textAlign: "left" as const,
  width: "100%",
  "&[data-ui-selected='true']": { borderColor: "primary.main" },
  "&[data-ui-interactive='true']": { cursor: "pointer" },
  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
};

export function UISelectableSurface(props: UISelectableSurfaceProps): ReactElement {
  const interactive = Boolean(props.interactive);

  const component: ElementType = interactive ? "button" : "article";

  return (
    <UIBox
      align="stretch"
      aria-current={props["aria-current"]}
      aria-label={props["aria-label"]}
      aria-pressed={interactive ? props["aria-pressed"] : undefined}
      component={component}
      data-ui-interactive={String(interactive)}
      data-ui-selected={String(props.selected)}
      disabled={interactive ? props.disabled : undefined}
      id={props.id}
      inset="md"
      layout="column"
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      sx={selectableSurfaceSx}
      type={interactive ? "button" : undefined}
    >
      {props.children}
    </UIBox>
  );
}
