import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export interface UIPageContentMainProps {
  children: ReactNode;
}

export function UIPageContentMain(props: UIPageContentMainProps): ReactElement {
  return (
    <UIBox
      component="main"
      inset="xl"
      layout="column"
      id="main-content"
      sx={{
        boxSizing: "border-box",
        bgcolor: "background.paper",
        borderInline: { md: "1px solid var(--mui-palette-divider)", xs: "none" },
        justifySelf: "center",
        maxWidth: { md: "500px", xs: "100%" },
        minHeight: { md: "calc(100vh - 64px)", xs: "auto" },
        minWidth: 0,
        px: { md: 3, xs: 2 },
        pb: { md: 5, xs: 11 },
        pt: { md: 4, xs: 3 },
        width: "100%",
      }}
    >
      {props.children}
    </UIBox>
  );
}
