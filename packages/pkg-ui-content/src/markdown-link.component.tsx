import { UILink } from "@guesant/saberes-ui";
import type { ComponentProps } from "react";

export type UIMarkdownLinkProps = ComponentProps<"a">;

export function UIMarkdownLink(props: UIMarkdownLinkProps) {
  const { href, children } = props;

  const url = href && /^https:\/\//i.test(href) ? href : undefined;

  return (
    <UILink href={url} target={url ? "_blank" : undefined} rel={url ? "noreferrer" : undefined}>
      {children}
    </UILink>
  );
}
