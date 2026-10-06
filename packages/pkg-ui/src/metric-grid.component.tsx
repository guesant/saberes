import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridProps = {
  children: ReactNode;
};

export function UIMetricGrid(props: UIMetricGridProps): ReactElement {
  return (
    <UIBox
      gap="md"
      inset="none"
      layout="grid"
      columns={2}
      sx={{ alignItems: "stretch", gridAutoRows: "1fr" }}
    >
      {props.children}
    </UIBox>
  );
}
