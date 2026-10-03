import { ArrowForwardIcon, Button, Paper, Typography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";

type QuestionLinkBlockViewProps = {
  block: Extract<EditorialBlock, { type: "question_link" }>;
  onQuestion?: (questionId: string | number) => void;
};

export function QuestionLinkBlockView(props: QuestionLinkBlockViewProps) {
  const { block, onQuestion } = props;

  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 2, my: 3 }}>
      <Typography fontWeight={700}>{block.title || t("content.practiceConcept")}</Typography>

      <Typography variant="body2">{block.description}</Typography>

      <Button onClick={() => onQuestion?.(block.questionId)} endIcon={<ArrowForwardIcon />}>
        {t("content.solveQuestion")}
      </Button>
    </Paper>
  );
}
