import { Grid as MuiGrid } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UICatalogCardGridItemProps = {
  children: ReactNode;
};

export function UICatalogCardGridItem(props: UICatalogCardGridItemProps): ReactElement {
  return <MuiGrid size={{ md: 6, xs: 12 }}>{props.children}</MuiGrid>;
}
