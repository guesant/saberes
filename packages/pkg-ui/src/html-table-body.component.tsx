import { UIBox } from "./box.component";
import type { ReactNode } from "react";

export type UIHtmlTableBodyProps = {
  children: ReactNode;
};

export function UIHtmlTableBody(props: UIHtmlTableBodyProps) {
  return <UIBox component="tbody" inset="none" layout="native">{props.children}</UIBox>;
}
