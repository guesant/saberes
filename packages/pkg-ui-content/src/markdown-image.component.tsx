import { Box } from "@guesant/saberes-ui";
import type { ComponentProps } from "react";

export type MarkdownImageProps = ComponentProps<"img">;

export function MarkdownImage(props: MarkdownImageProps) {
  const { src, alt } = props;

  const source = typeof src === "string" ? src : "";

  const url = /^https:\/\//i.test(source) || source.startsWith("/") ? source : undefined;

  return <Box component="img" src={url} alt={alt || ""} />;
}
