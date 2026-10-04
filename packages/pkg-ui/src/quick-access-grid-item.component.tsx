import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIQuickAccessGridItemProps = {
  children: ReactNode;
};

export function UIQuickAccessGridItem(props: UIQuickAccessGridItemProps): ReactElement {
  return (
    <MuiGrid data-ui-grid-item="equal" size={{ md: 3, xs: 6 }} sx={{ minWidth: 0 }}>
      {props.children}
    </MuiGrid>
  );
}
