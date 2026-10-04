import {
  BottomNavigation as MuiBottomNavigation,
  type BottomNavigationProps as MuiBottomNavigationProps,
} from "@mui/material";
import type { ReactElement } from "react";

export type UIBottomNavigationProps = MuiBottomNavigationProps;

export function UIBottomNavigation(props: UIBottomNavigationProps): ReactElement {
  return (
    <MuiBottomNavigation
      {...props}
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        bottom: 0,
        display: { md: "none", xs: "flex" },
        left: 0,
        position: "fixed",
        right: 0,
        zIndex: (theme) => {
          return theme.zIndex.appBar;
        },
        ...props.sx,
      }}
    />
  );
}
