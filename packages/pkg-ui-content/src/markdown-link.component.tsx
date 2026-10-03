import { Link } from "@guesant/saberes-ui";
import type { ComponentProps } from "react";

export type MarkdownLinkProps = ComponentProps<"a">;

export function MarkdownLink(props: MarkdownLinkProps) {
  const { href, children } = props;

  const url = href && /^https:\/\//i.test(href) ? href : undefined;

  return (
    <Link href={url} target={url ? "_blank" : undefined} rel={url ? "noreferrer" : undefined}>
      {children}
    </Link>
  );
}
