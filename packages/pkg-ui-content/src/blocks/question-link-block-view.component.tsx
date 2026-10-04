import { UIArrowForwardIcon, UIButton, UIContentSurface, UIContentText } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionLinkBlock } from "@guesant/saberes-application";

type UIQuestionLinkBlockViewProps = {
  block: QuestionLinkBlock;
  onQuestion?(questionId: string | number): void;
};

export function UIQuestionLinkBlockView(props: UIQuestionLinkBlockViewProps) {
  const { block, onQuestion } = props;

  const { t } = useTranslation();

  return (
    <UIContentSurface mode="outlined">
      <UIContentText variant="title">{block.title || t("content.practiceConcept")}</UIContentText>

      <UIContentText variant="body">{block.description}</UIContentText>

      <UIButton
        onClick={() => {
          return onQuestion?.(block.questionId);
        }}
        endIcon={<UIArrowForwardIcon />}
      >
        {t("content.solveQuestion")}
      </UIButton>
    </UIContentSurface>
  );
}
