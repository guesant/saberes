import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIPageSurfaceProps = {
  children: ReactNode;
};

export function UIPageSurface(props: UIPageSurfaceProps): ReactElement {
  return (
    <UIBox
      gap="none"
      inset="none"
      layout="native"
      data-testid="page-surface"
      sx={{
        display: "grid",
        height: "100vh",
        left: "50%",
        maxWidth: "500px",
        overflow: "hidden",
        position: "fixed",
        transform: "translateX(-50%)",
        gridTemplateColumns: "minmax(0, 1fr)",
        gridTemplateRows: "auto minmax(0, 1fr)",
        minHeight: 0,
        minWidth: 0,
        width: "100%",
        "@supports (height: 100dvh)": { height: "100dvh" },
        bgcolor: "background.default",
        "@media (max-width: 500px)": { left: 0, transform: "none" },
      }}
    >
      {props.children}
    </UIBox>
  );
}
