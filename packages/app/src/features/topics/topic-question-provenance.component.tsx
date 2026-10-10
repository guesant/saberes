import { UIListItemText } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { TopicQuestionReadModel } from "@guesant/saberes-application";

export interface TopicQuestionProvenanceProps {
  question: TopicQuestionReadModel;
}

export function TopicQuestionProvenance(props: TopicQuestionProvenanceProps) {
  const { t } = useTranslation();

  const {question} = props;

  const origin = [
    question.sourceEditionYear,
    question.sourceStageName,
    question.sourcePaperName,
    question.sourceBookletName,
    question.number,
  ].filter(Boolean)
    .join(" · ");

  const classification = t(`topics.classificationType.${question.classificationType}`);

  const evidence = [
    question.classificationSourceTitle,
    question.classificationSourcePage,
    question.classificationSourceUrl,
  ]
    .filter(Boolean)
    .join(" · ");

  const classificationDetails = [classification, evidence].filter(Boolean)
    .join(" · ");

  return (
    <UIListItemText
      primary={t("topics.questionLabel", { number: String(question.id) })}
      secondary={[question.statement, origin, classificationDetails].filter(Boolean)
        .join("\n")}
    />
  );
}
