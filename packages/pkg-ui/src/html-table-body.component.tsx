import type { ReactNode } from "react";

export type HtmlTableBodyProps = {
  children: ReactNode;
};

export function HtmlTableBody(props: HtmlTableBodyProps) {
  return <tbody>{props.children}</tbody>;
}
