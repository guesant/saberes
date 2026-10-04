import { UIContentFigure } from "@guesant/saberes-ui";
import type { ImageBlock } from "@guesant/saberes-application";

type UIImageFigureProps = {
  block: ImageBlock;
  url: string;
};

export function UIImageFigure(props: UIImageFigureProps) {
  const { block, url } = props;

  return <UIContentFigure alt={block.alt} caption={block.caption} src={url} />;
}
