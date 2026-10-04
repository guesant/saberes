import { UIListItemButton, UIListItemText } from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import type { AssessmentQuestionItemLinkProps } from "./assessment-question-item-link-props.type";

export function AssessmentQuestionItemLink(props: AssessmentQuestionItemLinkProps) {
  const { item } = props;

  const title = String(item.title || `Item ${String(item.position || "")}`);

  const description = String(item.description || item.item_type || "");

  return (
    <UIListItemButton component={Link} to={`/questoes/${String(item.question_occurrence_id)}`}>
      <UIListItemText primary={title} secondary={description} />
    </UIListItemButton>
  );
}
