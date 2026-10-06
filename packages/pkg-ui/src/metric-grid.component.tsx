import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIMetricGridProps = {
  children: ReactNode;
};

export function UIMetricGrid(props: UIMetricGridProps): ReactElement {
  return (
    <UIBox gap="md" inset="none" layout="grid" columns={3}>
      {props.children}
    </UIBox>
  );
}
