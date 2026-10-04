import { UIPaper, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";

type UISummaryBlockViewProps = {
  block: Extract<EditorialBlock, { type: "summary" }>;
};

export function UISummaryBlockView(props: UISummaryBlockViewProps) {
  const { block } = props;

  const { t } = useTranslation();

  return (
    <UIPaper
      sx={{
        p: 2.5,
        my: 3,
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <UITypography variant="h6">{block.title || t("content.summary")}</UITypography>

      <UITypography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{block.content}</UITypography>
    </UIPaper>
  );
}
