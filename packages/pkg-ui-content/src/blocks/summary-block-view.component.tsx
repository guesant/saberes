import { Paper, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";

type SummaryBlockViewProps = {
  block: Extract<EditorialBlock, { type: "summary" }>;
};

export function SummaryBlockView(props: SummaryBlockViewProps) {
  const { block } = props;

  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 2.5,
        my: 3,
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Typography variant="h6">{block.title || t("content.summary")}</Typography>

      <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{block.content}</Typography>
    </Paper>
  );
}
