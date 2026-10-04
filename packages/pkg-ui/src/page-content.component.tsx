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
              maxWidth: { md: "calc(100% - 264px)", xs: "lg" },
              py: { md: 5, xs: 3 },
              width: { md: "calc(100% - 264px)", xs: "auto" },
            }
          : { py: { md: 5, xs: 3 } }
      }
    >
      {props.children}
    </MuiContainer>
  );
}
