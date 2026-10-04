import { UIAlert, UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionPriorKnowledgeErrorProps } from "./question-prior-knowledge-error-props.type";

export function QuestionPriorKnowledgeError(props: QuestionPriorKnowledgeErrorProps) {
  const { t } = useTranslation();

  return (
    <UIAlert severity="warning">
      {t("exercise.priorKnowledgeError")}
      <UIButton onClick={props.onRetry} size="small">
        {t("common.retry")}
      </UIButton>
    </UIAlert>
  );
}
