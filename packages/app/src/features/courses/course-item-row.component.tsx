import { UIListItem, UIListItemText } from "@guesant/saberes-ui";
import { CourseItemAction } from "./course-item-action.component";

export type CourseItemRowProps = {
  item: Record<string, unknown>;
};

export function CourseItemRow(props: CourseItemRowProps) {
  const { item } = props;

  return (
    <UIListItem divider secondaryAction={<CourseItemAction item={item} />}>
      <UIListItemText primary={String(item.title)} secondary={String(item.description || "")} />
    </UIListItem>
  );
}
