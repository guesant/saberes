import type { ReactNode } from "react";

export type UIHtmlTableBodyProps = {
  children: ReactNode;
};

export function UIHtmlTableBody(props: UIHtmlTableBodyProps) {
  return <tbody>{props.children}</tbody>;
}
