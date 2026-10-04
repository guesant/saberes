import {
  BottomNavigationAction as MuiBottomNavigationAction,
  type BottomNavigationActionProps as MuiBottomNavigationActionProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIBottomNavigationActionProps = MuiBottomNavigationActionProps;

export function UIBottomNavigationAction(props: UIBottomNavigationActionProps): ReactElement {
  return <MuiBottomNavigationAction {...props} />;
}
