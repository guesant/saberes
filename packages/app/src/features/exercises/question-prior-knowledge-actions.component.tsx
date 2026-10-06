import { PriorKnowledgeStatus } from "@guesant/saberes-application";
import { UIChoiceButton, UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionPriorKnowledgeActionsProps } from "./question-prior-knowledge-actions-props.type";

export function QuestionPriorKnowledgeActions(props: QuestionPriorKnowledgeActionsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="list">
      <UIChoiceButton
        fullWidth
        variant={props.selected === PriorKnowledgeStatus.Known ? "contained" : "outlined"}
        disabled={props.disabled}
        onClick={() => {
          return props.onSelect(PriorKnowledgeStatus.Known);
        }}
      >
        {t("exercise.priorKnowledge.known")}
      </UIChoiceButton>
      <UIChoiceButton
        fullWidth
        variant={props.selected === PriorKnowledgeStatus.Uncertain ? "contained" : "outlined"}
        disabled={props.disabled}
        onClick={() => {
          return props.onSelect(PriorKnowledgeStatus.Uncertain);
        }}
      >
        {t("exercise.priorKnowledge.uncertain")}
      </UIChoiceButton>
      <UIChoiceButton
        fullWidth
        variant={props.selected === PriorKnowledgeStatus.Unknown ? "contained" : "outlined"}
        disabled={props.disabled}
        onClick={() => {
          return props.onSelect(PriorKnowledgeStatus.Unknown);
        }}
      >
        {t("exercise.priorKnowledge.unknown")}
      </UIChoiceButton>
    </UIContentGroup>
  );
}
