import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UIQuickAccessGridItemProps = {
  children: ReactNode;
};

export function UIQuickAccessGridItem(props: UIQuickAccessGridItemProps): ReactElement {
  return (
    <UIBox gap="none" inset="none" layout="column">
      {props.children}
    </UIBox>
  );
}
