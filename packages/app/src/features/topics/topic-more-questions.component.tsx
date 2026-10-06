import { UIDisclosure, UIList } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicQuestionLink } from "./topic-question-link.component";
import type { TopicQuestionReadModel } from "@guesant/saberes-application";

export interface TopicMoreQuestionsProps {
  questions: TopicQuestionReadModel[];
}

export function TopicMoreQuestions(props: TopicMoreQuestionsProps) {
  const { t } = useTranslation();

  return (
    <UIDisclosure summary={t("discovery.moreQuestions", { count: props.questions.length })}>
      <UIList>{props.questions.map((question) => { return <TopicQuestionLink key={question.id} question={question} />; })}</UIList>
    </UIDisclosure>
  );
}
