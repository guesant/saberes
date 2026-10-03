import { VideoPanel } from "./video-panel.component";
import type { EditorialBlock } from "@guesant/saberes-application";

type VideoBlockViewProps = {
  block: Extract<EditorialBlock, { type: "video" }>;
};

export function VideoBlockView(props: VideoBlockViewProps) {
  const { block } = props;

  const url = /^https:\/\//i.test(block.url) ? block.url : undefined;

  return url ? <VideoPanel block={block} url={url} /> : null;
}
