import { Box, Typography } from "@guesant/saberes-ui";
import type { EditorialBlock } from "@guesant/saberes-application";

type ImageFigureProps = {
  block: Extract<EditorialBlock, { type: "image" }>;
  url: string;
};

export function ImageFigure(props: ImageFigureProps) {
  const { block, url } = props;

  return (
    <Box component="figure" sx={{ my: 3, mx: 0, textAlign: "center" }}>
      <Box component="img" src={url} alt={block.alt} sx={{ maxWidth: "100%" }} />

      <Typography variant="caption">{block.caption}</Typography>
    </Box>
  );
}
