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
      inset="none"
      layout="flow"
      onClose={props.onClose}
      open={props.open}
      sx={{
        "& .MuiBackdrop-root": {
          height: "100%",
          left: "max(0px, calc((100vw - 500px) / 2))",
          right: "auto",
          width: "min(500px, 100vw)",
        },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          left: "max(0px, calc((100vw - 500px) / 2))",
          maxWidth: "min(320px, calc(100vw - 48px))",
          width: 280,
        },
      }}
      variant="temporary"
    >
      {props.children}
    </UIBox>
  );
}
