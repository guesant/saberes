import { UIListItem, UIListItemText } from "@guesant/saberes-ui";

export interface CourseItemStaticRowProps {
  title: string;
  description: string;
}

export function CourseItemStaticRow(props: CourseItemStaticRowProps) {
  return <UIListItem><UIListItemText primary={props.title} secondary={props.description} /></UIListItem>;
}
