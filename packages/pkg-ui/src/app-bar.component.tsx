import { AppBar as MuiAppBar, type AppBarProps as MuiAppBarProps } from "@mui/material";
import { UIBox } from "./box.component";
import type { ReactElement } from "react";

export type UIAppBarProps = Omit<MuiAppBarProps, "position" | "sx">;

export function UIAppBar(props: UIAppBarProps): ReactElement {
  return (
    <UIBox
      {...props}
      component={MuiAppBar}
      inset="none"
      layout="flow"
      position="sticky"
      sx={{ gridColumn: "2", justifySelf: "center", maxWidth: "500px", width: "100%" }}
    />
  );
}
