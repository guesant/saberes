import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicQuestionPreview } from "./topic-question-preview.component";
import type { TopicQuestionListProps } from "./topic-question-list-props.type";

export function TopicQuestionList(props: TopicQuestionListProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup id="pratica" variant="section">
      <UITypography variant="h5">{t("discovery.practice")}</UITypography>
      <TopicQuestionPreview questions={props.questions} />
    </UIContentGroup>
  );
}
