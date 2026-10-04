import { AssessmentEmptyState } from "./assessment-empty-state.component";
import { AssessmentItemList } from "./assessment-item-list.component";
import type { AssessmentItemsViewProps } from "./assessment-items-view-props.type";

export function AssessmentItemsView(props: AssessmentItemsViewProps) {
  if (props.items.length) {
    return <AssessmentItemList items={props.items} />;
  }

  return <AssessmentEmptyState />;
}
