import { Box as MuiBox } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIPageSurfaceProps = {
  children: ReactNode;
};

export function UIPageSurface(props: UIPageSurfaceProps): ReactElement {
  return (
    <MuiBox
      data-ui-layout="page-shell"
      sx={{
        display: { md: "grid", xs: "block" },
        gridTemplateColumns: {
          md: "264px minmax(0, 1fr) 264px",
          xs: "minmax(0, 1fr)",
        },
        gridTemplateRows: { md: "64px minmax(0, 1fr)", xs: "auto" },
        minHeight: "100vh",
        bgcolor: "background.default",
        "& > [data-ui-layout='toolbar']": { gridColumn: "1 / -1" },
      }}
    >
      {props.children}
    </MuiBox>
  );
}
