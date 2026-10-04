import { UIButton, UIContentSurface, UIContentText, UIOpenInNewIcon } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { VideoBlock } from "@guesant/saberes-application";

type UIVideoPanelProps = {
  block: VideoBlock;
  url: string;
};

export function UIVideoPanel(props: UIVideoPanelProps) {
  const { block, url } = props;

  const { t } = useTranslation();

  return (
    <UIContentSurface mode="outlined">
      <UIContentText variant="title">{block.title || t("content.recommendedVideo")}</UIContentText>

      <UIButton href={url} target="_blank" rel="noreferrer" endIcon={<UIOpenInNewIcon />}>
        {t("content.openVideo")}
      </UIButton>
    </UIContentSurface>
  );
}
