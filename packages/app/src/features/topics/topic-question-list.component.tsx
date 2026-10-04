import { UIContentGroup, UIList, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { TopicQuestionLink } from "./topic-question-link.component";
import type { TopicQuestionListProps } from "./topic-question-list-props.type";

export function TopicQuestionList(props: TopicQuestionListProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="list">
      <UITypography variant="h5">{t("topics.questions")}</UITypography>
      <UIList>
        {props.questions.map((question) => {
          return <TopicQuestionLink key={String(question.id)} question={question} />;
        })}
      </UIList>
    </UIContentGroup>
  );
}
