import { UIBox } from "./box.component";
import { UIPageContentMain } from "./page-content-main.component";
import type { ReactElement, ReactNode } from "react";

export type UIPageContentProps = {
  children: ReactNode;
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
        gridColumn: "1",
        gridRow: 2,
        gridTemplateColumns: "minmax(0, 1fr)",
        gridTemplateRows: "minmax(0, 1fr)",
        height: "100%",
        justifySelf: "stretch",
        minHeight: 0,
        minWidth: 0,
        justifyItems: "center",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <UIPageContentMain>{props.children}</UIPageContentMain>
    </UIBox>
  );
}
