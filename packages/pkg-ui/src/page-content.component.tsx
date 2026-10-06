import { UIBox } from "./box.component";
import { UIPageContentMain } from "./page-content-main.component";
import type { ReactElement, ReactNode } from "react";

export type UIPageContentProps = {
  children: ReactNode;
  sidebarAware?: boolean;
};

export function UIPageContent(props: UIPageContentProps): ReactElement {
  return (
    <UIBox
      component="div"
      inset="none"
      layout="column"
      sx={{
        alignContent: "start",
        boxSizing: "border-box",
        bgcolor: "background.default",
        display: "grid",
        gridColumn: props.sidebarAware ? { md: "2", xs: "1 / -1" } : "1 / -1",
        gridTemplateColumns: "minmax(0, 1fr)",
        justifySelf: "stretch",
        minHeight: { md: "calc(100vh - 64px)", xs: "auto" },
        minWidth: 0,
        justifyItems: "center",
        width: "100%",
      }}
    >
      <UIPageContentMain>{props.children}</UIPageContentMain>
    </UIBox>
  );
}
