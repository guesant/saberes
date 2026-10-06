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
        height: "100%",
        justifySelf: "center",
        maxWidth: { md: "500px", xs: "100%" },
        minHeight: 0,
        minWidth: 0,
        overflowX: "hidden",
        overflowY: "auto",
        overscrollBehaviorY: "contain",
        px: { md: 3, xs: 2 },
        pb: 5,
        pt: { md: 4, xs: 3 },
        scrollbarGutter: "stable",
        width: "100%",
      }}
    >
      {props.children}
    </UIBox>
  );
}
