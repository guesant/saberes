import { UIBox } from "./box.component";
import { UIDrawer } from "./drawer.component";
import type { ReactElement, ReactNode } from "react";

export interface UIResponsiveNavigationDrawerProps {
  children: ReactNode;
}

export function UIResponsiveNavigationDrawer(
  props: UIResponsiveNavigationDrawerProps,
): ReactElement {
  return (
    <UIBox
      anchor="left"
      component={UIDrawer}
      data-testid="desktop-navigation-drawer"
      inset="none"
      layout="flow"
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
    </UIBox>
  );
}
