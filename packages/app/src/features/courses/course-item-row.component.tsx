import { ListItem, ListItemText } from "@guesant/saberes-ui";
import { CourseItemAction } from "./course-item-action.component";

export type CourseItemRowProps = {
  item: Record<string, unknown>;
};

export function CourseItemRow(props: CourseItemRowProps) {
  const { item } = props;

  return (
    <ListItem divider secondaryAction={<CourseItemAction item={item} />}>
      <ListItemText primary={String(item.title)} secondary={String(item.description || "")} />
    </ListItem>
  );
}
