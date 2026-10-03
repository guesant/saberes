import { ImageFigure } from "./image-figure.component";
import type { EditorialBlock } from "@guesant/saberes-domain";

type ImageBlockViewProps = {
  block: Extract<EditorialBlock, { type: "image" }>;
};

export function ImageBlockView(props: ImageBlockViewProps) {
  const { block } = props;

  const url = /^https:\/\//i.test(block.src) || block.src.startsWith("/") ? block.src : undefined;

  return url ? <ImageFigure block={block} url={url} /> : null;
}
