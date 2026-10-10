import { UIBox } from "./box.component";
import { UIDrawer } from "./drawer.component";
import type { DrawerProps } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export interface UINavigationDrawerProps {
  children: ReactNode;
  onClose: DrawerProps["onClose"];
  open: boolean;
}

export function UINavigationDrawer(props: UINavigationDrawerProps): ReactElement {
  return (
    <UIBox
      anchor="left"
      component={UIDrawer}
      data-testid="navigation-drawer"
      container={() => document.querySelector('[data-testid="page-surface"]')}
      inset="none"
      layout="flow"
      onClose={props.onClose}
      open={props.open}
      sx={{
        inset: 0,
        position: "absolute",
        "& .MuiBackdrop-root": {
          height: "100%",
          position: "absolute",
          width: "100%",
        },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          left: 0,
          maxWidth: "min(320px, 100%)",
          position: "absolute",
          width: 280,
        },
      }}
      variant="temporary"
    >
      {props.children}
    </UIBox>
  );
}
