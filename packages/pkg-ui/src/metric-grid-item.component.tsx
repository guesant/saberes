import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridItemProps = {
  children: ReactNode;
};

export function UIMetricGridItem(props: UIMetricGridItemProps): ReactElement {
  return (
    <UIBox
      align="stretch"
      gap="none"
      inset="none"
      layout="column"
      sx={{ height: "100%", "& > *": { flex: 1 } }}
    >
      {props.children}
    </UIBox>
  );
}
