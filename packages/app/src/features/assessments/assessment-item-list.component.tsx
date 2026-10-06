import { UIDivider, UIList } from "@guesant/saberes-ui";
import { AssessmentItemListEntry } from "./assessment-item-list-entry.component";
import type { AssessmentItemListProps } from "./assessment-item-list-props.type";

export function AssessmentItemList(props: AssessmentItemListProps) {
  return (
    <UIList>
      {props.items.map((item) => {
        return <AssessmentItemListEntry key={String(item.position)} item={item} />;
      })}
      <UIDivider />
    </UIList>
  );
}
