import { UIGrid } from "./layout/grid.component";
import type { ReactElement, ReactNode } from "react";

export interface UIEqualActionsGridProps {
  content: ReactNode;
}

export function UIEqualActionsGrid(props: UIEqualActionsGridProps): ReactElement {
  return (
    <UIGrid minItemWidth="compact">
      {props.content}
    </UIGrid>
  );
}
