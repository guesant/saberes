import { UIContentGroup, UIList } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicEmptySection } from "./topic-empty-section.component";
import { TopicMoreQuestions } from "./topic-more-questions.component";
import { TopicQuestionLink } from "./topic-question-link.component";
import type { TopicQuestionListProps } from "./topic-question-list-props.type";

export type TopicQuestionPreviewProps = TopicQuestionListProps;

export function TopicQuestionPreview(props: TopicQuestionPreviewProps) {
  const { t } = useTranslation();

  if (!props.questions.length) {
    return <TopicEmptySection label={t("discovery.noPractice")} />;
  }

  return (
    <UIContentGroup variant="list">
      <UIList>{props.questions.slice(0, 3)
        .map((question) => { return <TopicQuestionLink key={question.id} question={question} />; })}</UIList>
      {props.questions.length > 3 && <TopicMoreQuestions questions={props.questions.slice(3)} />}
    </UIContentGroup>
  );
}
