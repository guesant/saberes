import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export interface UIDiscoveryGridProps {
  children: ReactNode;
  label: string;
}

export function UIDiscoveryGrid(props: UIDiscoveryGridProps): ReactElement {
  return (
    <UIBox
      aria-label={props.label}
      component="nav"
      columns={3}
      gap="md"
      inset="none"
      layout="grid"
    >
      {props.children}
    </UIBox>
  );
}
