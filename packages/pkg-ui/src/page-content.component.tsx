import { Container as MuiContainer } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

export type UIPageContentProps = {
  children: ReactNode;
  sidebarAware?: boolean;
};

export function UIPageContent(props: UIPageContentProps): ReactElement {
  return (
    <MuiContainer
      component="main"
      data-ui-inset="xl"
      data-ui-layout="page-shell"
      data-ui-outset="none"
      id="main-content"
      maxWidth="lg"
      sx={{
        boxSizing: "border-box",
        gridColumn: props.sidebarAware ? { md: "2", xs: "1" } : "1 / -1",
        justifySelf: { md: "center", xs: "stretch" },
        maxWidth: { md: "60rem", xs: "100%" },
        minWidth: 0,
        px: { md: 3, xs: 2 },
        pb: { md: 5, xs: 11 },
        pt: { md: 4, xs: 3 },
        width: "100%",
      }}
    >
      {props.children}
    </MuiContainer>
  );
}
