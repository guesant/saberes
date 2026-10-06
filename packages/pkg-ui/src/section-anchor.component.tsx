import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UISectionAnchorProps = {
  ariaLabelledBy?: string;
  children: ReactNode;
  hidden?: boolean;
  id: string;
  role?: "tabpanel";
  tabIndex?: number;
};

export function UISectionAnchor(props: UISectionAnchorProps): ReactElement {
  return (
    <UIBox
      aria-labelledby={props.ariaLabelledBy}
      hidden={props.hidden}
      id={props.id}
      inset="none"
      layout="flow"
      role={props.role}
      tabIndex={props.tabIndex}
    >
      {props.children}
    </UIBox>
  );
}
