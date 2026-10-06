import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIQuickAccessGridProps = {
  children: ReactNode;
};

export function UIQuickAccessGrid(props: UIQuickAccessGridProps): ReactElement {
  return (
    <UIBox gap="md" inset="none" layout="grid" sx={{ gridTemplateColumns: { md: "repeat(4, minmax(0, 1fr))", xs: "repeat(2, minmax(0, 1fr))" } }}>
      {props.children}
    </UIBox>
  );
}
