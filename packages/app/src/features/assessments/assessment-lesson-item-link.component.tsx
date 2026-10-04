import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { AssessmentLessonItemLinkProps } from "./assessment-lesson-item-link-props.type";

export function AssessmentLessonItemLink(props: AssessmentLessonItemLinkProps) {
  const { item } = props;

  const title = String(item.title || `Item ${String(item.position || "")}`);

  const description = String(item.description || item.item_type || "");

  return (
    <UIListItemButton component={Link} to={`/licoes/${String(item.lesson_id)}`}>
      <UIListItemText primary={title} secondary={description} />
    </UIListItemButton>
  );
}
