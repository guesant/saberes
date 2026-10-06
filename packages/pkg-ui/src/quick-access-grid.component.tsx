import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIQuickAccessGridProps = {
  children: ReactNode;
};

export function UIQuickAccessGrid(props: UIQuickAccessGridProps): ReactElement {
  return (
    <UIBox columns={2} gap="md" inset="none" layout="grid" minItemWidth="compact">
      {props.children}
    </UIBox>
  );
}
