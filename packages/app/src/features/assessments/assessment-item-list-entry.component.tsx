import { AssessmentItemLink } from "./assessment-item-link.component";
import type { AssessmentItemListEntryProps } from "./assessment-item-list-entry-props.type";

export function AssessmentItemListEntry(props: AssessmentItemListEntryProps) {
  return (
    <AssessmentItemLink item={props.item} />
  );
}
