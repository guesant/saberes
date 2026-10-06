import { UIBox } from "./box.component";
import type { ReactNode } from "react";

export type UIHtmlTableHeadProps = {
  children: ReactNode;
};

export function UIHtmlTableHead(props: UIHtmlTableHeadProps) {
  return <UIBox component="thead" inset="none" layout="native">{props.children}</UIBox>;
}
