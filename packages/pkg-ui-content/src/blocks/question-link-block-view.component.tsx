import { UIArrowForwardIcon, UIButton, UIPaper, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { EditorialBlock } from "@guesant/saberes-application";

type UIQuestionLinkBlockViewProps = {
  block: Extract<EditorialBlock, { type: "question_link" }>;
  onQuestion?: (questionId: string | number) => void;
};

export function UIQuestionLinkBlockView(props: UIQuestionLinkBlockViewProps) {
  const { block, onQuestion } = props;

  const { t } = useTranslation();

  return (
    <UIPaper variant="outlined" sx={{ p: 2, my: 3 }}>
      <UITypography fontWeight={700}>{block.title || t("content.practiceConcept")}</UITypography>

      <UITypography variant="body2">{block.description}</UITypography>

      <UIButton onClick={() => onQuestion?.(block.questionId)} endIcon={<UIArrowForwardIcon />}>
        {t("content.solveQuestion")}
      </UIButton>
    </UIPaper>
  );
}
