import { UIListItem, UIListItemText } from "@guesant/saberes-ui";
import type { AssessmentUnavailableItemProps } from "./assessment-unavailable-item-props.type";

export function AssessmentUnavailableItem(props: AssessmentUnavailableItemProps) {
  const { item } = props;

  const title = String(item.title || `Item ${String(item.position || "")}`);

  const description = String(item.description || item.item_type || "");

  return (
    <UIListItem>
      <UIListItemText primary={title} secondary={description} />
    </UIListItem>
  );
}
