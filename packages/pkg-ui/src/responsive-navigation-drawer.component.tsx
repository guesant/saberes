import { UIDrawer } from "./drawer.component";
import type { ReactElement, ReactNode } from "react";

export interface UIResponsiveNavigationDrawerProps {
  children: ReactNode;
  mobileOpen: boolean;
  onMobileClose(): void;
}

export function UIResponsiveNavigationDrawer(
  props: UIResponsiveNavigationDrawerProps,
): ReactElement {
  return (
    <>
      <UIDrawer
        anchor="left"
        open
        sx={{
          display: { md: "block", xs: "none" },
          width: 264,
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 264 },
        }}
        variant="permanent"
      >
        {props.children}
      </UIDrawer>
      <UIDrawer
        anchor="left"
        onClose={props.onMobileClose}
        open={props.mobileOpen}
        sx={{ display: { md: "none", xs: "block" } }}
        variant="temporary"
      >
        {props.children}
      </UIDrawer>
    </>
  );
}
