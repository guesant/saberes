import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridItemProps = {
  children: ReactNode;
};

export function UICatalogCardGridItem(props: UICatalogCardGridItemProps): ReactElement {
  return (
    <MuiGrid minWidth={0} size={{ md: 6, xs: 12 }} sx={{ maxWidth: "100%" }}>
      {props.children}
    </MuiGrid>
  );
}
