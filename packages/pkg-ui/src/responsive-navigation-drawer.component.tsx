import { UIDrawer } from "./drawer.component";
import type { ReactElement, ReactNode } from "react";

export interface UIResponsiveNavigationDrawerProps {
  children: ReactNode;
}

export function UIResponsiveNavigationDrawer(
  props: UIResponsiveNavigationDrawerProps,
): ReactElement {
  return (
    <UIDrawer
      anchor="left"
      data-ui-layout="stack"
      open
      sx={{
        display: { md: "block", xs: "none" },
        width: 264,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          height: { md: "calc(100% - 64px)", xs: "100%" },
          top: { md: "64px", xs: 0 },
          width: 264,
        },
      }}
      variant="permanent"
    >
      {props.children}
    </UIDrawer>
  );
}
