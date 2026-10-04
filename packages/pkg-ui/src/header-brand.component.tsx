import { Typography as MuiTypography } from "@mui/material";
import type { ReactElement } from "react";

export type UIHeaderBrandProps = {
  children: string;
  href: string;
};

export function UIHeaderBrand(props: UIHeaderBrandProps): ReactElement {
  return (
    <MuiTypography component="a" href={props.href} sx={{ flexGrow: 1, ml: 1 }} variant="h6">
      {props.children}
    </MuiTypography>
  );
}
