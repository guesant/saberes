import { UIBox } from "./box.component";
import type { ReactNode } from "react";

export type UIHtmlTableRowProps = {
  children: ReactNode;
};

export function UIHtmlTableRow(props: UIHtmlTableRowProps) {
  return <UIBox component="tr" inset="none" layout="native">{props.children}</UIBox>;
}
