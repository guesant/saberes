import { Drawer as MuiDrawer, type DrawerProps as MuiDrawerProps } from "@mui/material";
import type { ReactElement } from "react";

export type DrawerProps = MuiDrawerProps;

export function Drawer(props: DrawerProps): ReactElement {
  return <MuiDrawer {...props} />;
}
