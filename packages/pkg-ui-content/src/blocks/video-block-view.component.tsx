import { UIVideoPanel } from "./video-panel.component";
import type { EditorialBlock } from "@guesant/saberes-application";

type UIVideoBlockViewProps = {
  block: Extract<EditorialBlock, { type: "video" }>;
};

export function UIVideoBlockView(props: UIVideoBlockViewProps) {
  const { block } = props;

  const url = /^https:\/\//i.test(block.url) ? block.url : undefined;

  return url ? <UIVideoPanel block={block} url={url} /> : null;
}
