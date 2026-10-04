import { UIImageFigure } from "./image-figure.component";
import type { EditorialBlock } from "@guesant/saberes-application";

type UIImageBlockViewProps = {
  block: Extract<EditorialBlock, { type: "image" }>;
};

export function UIImageBlockView(props: UIImageBlockViewProps) {
  const { block } = props;

  const url = /^https:\/\//i.test(block.src) || block.src.startsWith("/") ? block.src : undefined;

  return url ? <UIImageFigure block={block} url={url} /> : null;
}
