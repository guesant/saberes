import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { TopicQuestionLinkProps } from "./topic-question-link-props.type";

export function TopicQuestionLink(props: TopicQuestionLinkProps) {
  const { t } = useTranslation();

  return (
    <UIListItemButton component={Link} to={`/questoes/${String(props.question.id)}`}>
      <UIListItemText
        primary={t("topics.questionLabel", {
          number: String(props.question.number || props.question.id),
        })}
        secondary={String(props.question.statement || "")}
      />
    </UIListItemButton>
  );
}
