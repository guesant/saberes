import { UIListItemButton } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import { TopicQuestionProvenance } from "./topic-question-provenance.component";
import type { TopicQuestionLinkProps } from "./topic-question-link-props.type";

export function TopicQuestionLink(props: TopicQuestionLinkProps) {
  return (
    <UIListItemButton component={Link} to={props.question.href}>
      <TopicQuestionProvenance question={props.question} />
    </UIListItemButton>
  );
}
