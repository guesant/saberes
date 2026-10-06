import { UIBox } from "@guesant/saberes-ui";
import type { ComponentProps } from "react";

export type UIMarkdownImageProps = ComponentProps<"img">;

export function UIMarkdownImage(props: UIMarkdownImageProps) {
  const { src, alt } = props;

  const source = typeof src === "string" ? src : "";

  const url = /^https:\/\//i.test(source) || source.startsWith("/") ? source : undefined;

  return <UIBox component="img" layout="flow" src={url} alt={alt || ""} />;
}
