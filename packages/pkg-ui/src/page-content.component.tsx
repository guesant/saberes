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
      id="main-content"
      maxWidth="lg"
      sx={
        props.sidebarAware
          ? {
            boxSizing: "border-box",
            marginLeft: { md: "264px", xs: "auto" },
            marginRight: { md: 0, xs: "auto" },
            maxWidth: { md: "calc(100% - 264px)", xs: "100%" },
            minWidth: 0,
            pb: { md: 5, xs: 11 },
            pt: { md: 5, xs: 3 },
            width: { md: "calc(100% - 264px)", xs: "100%" },
          }
          : { minWidth: 0, pb: { md: 5, xs: 11 }, pt: { md: 5, xs: 3 }, width: "100%" }
      }
    >
      {props.children}
    </MuiContainer>
  );
}
