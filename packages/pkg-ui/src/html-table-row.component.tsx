import type { ReactNode } from "react";

export type UIHtmlTableRowProps = {
  children: ReactNode;
};

export function UIHtmlTableRow(props: UIHtmlTableRowProps) {
  return <tr>{props.children}</tr>;
}
