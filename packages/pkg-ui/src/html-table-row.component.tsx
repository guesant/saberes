import type { ReactNode } from "react";

export type HtmlTableRowProps = {
  children: ReactNode;
};

export function HtmlTableRow(props: HtmlTableRowProps) {
  return <tr>{props.children}</tr>;
}
