import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionPriorKnowledgeActions } from "./question-prior-knowledge-actions.component";
import { QuestionPriorKnowledgeError } from "./question-prior-knowledge-error.component";
import { QuestionPriorKnowledgeSaved } from "./question-prior-knowledge-saved.component";
import { useQuestionPriorKnowledgeSelection } from "./use-question-prior-knowledge-selection.hook";
import type { PriorKnowledgeStatus } from "@guesant/saberes-application";

export type QuestionPriorKnowledgeProps = {
  onSelect: (status: PriorKnowledgeStatus) => Promise<void>;
};

export function QuestionPriorKnowledge(props: QuestionPriorKnowledgeProps) {
  const { t } = useTranslation();

  const selection = useQuestionPriorKnowledgeSelection({
    errorMessage: t("exercise.priorKnowledgeError"),
    onSelect: props.onSelect,
  });

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h6">{t("exercise.priorKnowledgeLabel")}</UITypography>
      <UITypography>{t("exercise.priorKnowledgeHint")}</UITypography>
      <QuestionPriorKnowledgeActions
        disabled={selection.saving}
        onSelect={selection.selectStatus}
        selected={selection.selected}
      />
      {selection.error ? <QuestionPriorKnowledgeError onRetry={selection.retry} /> : null}
      {selection.selected ? <QuestionPriorKnowledgeSaved /> : null}
    </UIContentGroup>
  );
}
