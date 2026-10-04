import { UIBox, UITypography } from "@guesant/saberes-ui";
import type { ImageBlock } from "@guesant/saberes-application";

type UIImageFigureProps = {
  block: ImageBlock;
  url: string;
};

export function UIImageFigure(props: UIImageFigureProps) {
  const { block, url } = props;

  return (
    <UIBox component="figure" sx={{ my: 3, mx: 0, textAlign: "center" }}>
      <UIBox component="img" src={url} alt={block.alt} sx={{ maxWidth: "100%" }} />

      <UITypography variant="caption">{block.caption}</UITypography>
    </UIBox>
  );
}
