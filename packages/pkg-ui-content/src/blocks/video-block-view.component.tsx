import { UIVideoPanel } from "./video-panel.component";
import type { VideoBlock } from "@guesant/saberes-application";

type UIVideoBlockViewProps = {
  block: VideoBlock;
};

export function UIVideoBlockView(props: UIVideoBlockViewProps) {
  const { block } = props;

  const url = /^https:\/\//i.test(block.url) ? block.url : undefined;

  return url ? <UIVideoPanel block={block} url={url} /> : null;
}
