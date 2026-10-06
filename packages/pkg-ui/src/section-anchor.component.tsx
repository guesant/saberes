import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UISectionAnchorProps = {
  children: ReactNode;
  id: string;
};

export function UISectionAnchor(props: UISectionAnchorProps): ReactElement {
  return <UIBox id={props.id} inset="none" layout="flow">{props.children}</UIBox>;
}
