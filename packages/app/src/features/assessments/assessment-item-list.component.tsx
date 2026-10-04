import { UIList } from "@guesant/saberes-ui";
import { AssessmentItemLink } from "./assessment-item-link.component";
import type { AssessmentItemListProps } from "./assessment-item-list-props.type";

export function AssessmentItemList(props: AssessmentItemListProps) {
  return (
    <UIList>
      {props.items.map((item) => {
        return <AssessmentItemLink key={String(item.position)} item={item} />;
      })}
    </UIList>
  );
}
