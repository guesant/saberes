import {
  BottomNavigation as MuiBottomNavigation,
  type BottomNavigationProps as MuiBottomNavigationProps,
} from "@mui/material";
import { UIBox } from "./box.component";
import type { ReactElement } from "react";

export type UIBottomNavigationProps = Omit<MuiBottomNavigationProps, "component" | "sx">;

export function UIBottomNavigation(props: UIBottomNavigationProps): ReactElement {
  return (
    <UIBox
      component="nav"
      aria-label="Navegação principal"
      gap="none"
      inset="none"
      layout="row"
      role="navigation"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        bottom: 0,
        display: { md: "none", xs: "flex" },
        left: 0,
        position: "fixed",
        paddingBottom: "env(safe-area-inset-bottom)",
        right: 0,
        zIndex: (theme) => {
          return theme.zIndex.appBar;
        },
      }}
    >
      <MuiBottomNavigation {...props} />
    </UIBox>
  );
}
