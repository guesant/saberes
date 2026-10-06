import { Typography as MuiTypography } from "@mui/material";
import type { ReactElement } from "react";

export type UIHeaderBrandProps = {
  children: string;
  href: string;
};

export function UIHeaderBrand(props: UIHeaderBrandProps): ReactElement {
  return (
    <MuiTypography
      component="a"
      href={props.href}
      sx={{
        "&:hover": { color: "common.white", textDecoration: "none" },
        "&:visited": { color: "common.white", textDecoration: "none" },
        color: "common.white",
        flexGrow: 1,
        ml: 1,
        minWidth: 0,
        overflow: "hidden",
        textDecoration: "none",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
      variant="h6"
    >
      {props.children}
    </MuiTypography>
  );
}
