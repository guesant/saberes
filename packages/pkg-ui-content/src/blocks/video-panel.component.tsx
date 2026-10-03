import { Button, OpenInNewIcon, Paper, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-domain";

type VideoPanelProps = {
  block: Extract<EditorialBlock, { type: "video" }>;
  url: string;
};

export function VideoPanel(props: VideoPanelProps) {
  const { block, url } = props;

  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
      <Typography fontWeight={700}>{block.title || t("content.recommendedVideo")}</Typography>

      <Button href={url} target="_blank" rel="noreferrer" endIcon={<OpenInNewIcon />}>
        {t("content.openVideo")}
      </Button>
    </Paper>
  );
}
