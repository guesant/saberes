import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIPageSurfaceProps = {
  children: ReactNode;
};

export function UIPageSurface(props: UIPageSurfaceProps): ReactElement {
  return (
    <UIBox
      inset="none"
      layout="grid"
      sx={{
        height: "100vh",
        inset: 0,
        overflow: "hidden",
        position: "fixed",
        gridTemplateColumns: {
          md: "264px minmax(0, 1fr) 264px",
          xs: "minmax(0, 1fr)",
        },
        gridTemplateRows: "auto minmax(0, 1fr)",
        minHeight: 0,
        minWidth: 0,
        width: "100%",
        "@supports (height: 100dvh)": { height: "100dvh" },
        bgcolor: "background.default",
      }}
    >
      {props.children}
    </UIBox>
  );
}
