import type { ReactNode } from "react";

export type HtmlStrongTextProps = {
  children: ReactNode;
};

export function HtmlStrongText(props: HtmlStrongTextProps) {
  return <strong>{props.children}</strong>;
}
