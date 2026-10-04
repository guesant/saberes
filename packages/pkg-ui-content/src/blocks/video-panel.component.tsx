import { UIButton, UIOpenInNewIcon, UIPaper, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";

type UIVideoPanelProps = {
  block: Extract<EditorialBlock, { type: "video" }>;
  url: string;
};

export function UIVideoPanel(props: UIVideoPanelProps) {
  const { block, url } = props;

  const { t } = useTranslation();

  return (
    <UIPaper variant="outlined" sx={{ p: 2, my: 3 }}>
      <UITypography fontWeight={700}>{block.title || t("content.recommendedVideo")}</UITypography>

      <UIButton href={url} target="_blank" rel="noreferrer" endIcon={<UIOpenInNewIcon />}>
        {t("content.openVideo")}
      </UIButton>
    </UIPaper>
  );
}
