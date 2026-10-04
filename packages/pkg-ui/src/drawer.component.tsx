import { Drawer as MuiDrawer, type DrawerProps as MuiDrawerProps } from "@mui/material";
import type { ReactElement } from "react";

export type UIDrawerProps = MuiDrawerProps;

export function UIDrawer(props: UIDrawerProps): ReactElement {
  return <MuiDrawer {...props} />;
}
