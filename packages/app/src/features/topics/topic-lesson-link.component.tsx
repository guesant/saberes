import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { TopicLessonLinkProps } from "./topic-lesson-link-props.type";

export function TopicLessonLink(props: TopicLessonLinkProps) {
  return (
    <UIListItemButton component={Link} to={`/licoes/${String(props.lesson.id)}`}>
      <UIListItemText
        primary={String(props.lesson.title)}
        secondary={String(props.lesson.description || "")}
      />
    </UIListItemButton>
  );
}
