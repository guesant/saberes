import { UIBox } from "./box.component";
import type { ReactElement, ReactNode } from "react";

export type UICodeTextProps = {
  children: ReactNode;
};

export function UICodeText(props: UICodeTextProps): ReactElement {
  return <UIBox component="code" inset="none" layout="flow">{props.children}</UIBox>;
}
