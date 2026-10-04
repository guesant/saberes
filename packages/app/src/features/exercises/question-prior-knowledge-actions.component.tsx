import { PriorKnowledgeStatus } from "@guesant/saberes-application";
import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionPriorKnowledgeActionsProps } from "./question-prior-knowledge-actions-props.type";

export function QuestionPriorKnowledgeActions(props: QuestionPriorKnowledgeActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIButton
        variant={props.selected === PriorKnowledgeStatus.Known ? "contained" : "outlined"}
        disabled={props.disabled}
        onClick={() => props.onSelect(PriorKnowledgeStatus.Known)}
      >
        {t("exercise.priorKnowledge.known")}
      </UIButton>
      <UIButton
        variant={props.selected === PriorKnowledgeStatus.Uncertain ? "contained" : "outlined"}
        disabled={props.disabled}
        onClick={() => props.onSelect(PriorKnowledgeStatus.Uncertain)}
      >
        {t("exercise.priorKnowledge.uncertain")}
      </UIButton>
      <UIButton
        variant={props.selected === PriorKnowledgeStatus.Unknown ? "contained" : "outlined"}
        disabled={props.disabled}
        onClick={() => props.onSelect(PriorKnowledgeStatus.Unknown)}
      >
        {t("exercise.priorKnowledge.unknown")}
      </UIButton>
    </UIInlineActions>
  );
}
