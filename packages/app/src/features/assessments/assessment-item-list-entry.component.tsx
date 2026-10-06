import { UIDivider } from "@guesant/saberes-ui";
import { AssessmentItemLink } from "./assessment-item-link.component";
import type { AssessmentItemListEntryProps } from "./assessment-item-list-entry-props.type";

export function AssessmentItemListEntry(props: AssessmentItemListEntryProps) {
  return (
    <>
      <UIDivider />
      <AssessmentItemLink item={props.item} />
    </>
  );
}
