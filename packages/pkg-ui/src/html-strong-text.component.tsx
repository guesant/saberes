import type { ReactNode } from "react";

export type UIHtmlStrongTextProps = {
  children: ReactNode;
};

export function UIHtmlStrongText(props: UIHtmlStrongTextProps) {
  return <strong>{props.children}</strong>;
}
