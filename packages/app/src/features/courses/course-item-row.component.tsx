import {
  UIArrowForwardIcon,
  UIListItemButton,
  UIListItemText,
} from "@guesant/saberes-ui";
import { Link } from "react-router-dom";
import { CourseItemStaticRow } from "./course-item-static-row.component";
import { getCourseItemHref } from "./get-course-item-href.function";

export type CourseItemRowProps = {
  item: Record<string, unknown>;
};

export function CourseItemRow(props: CourseItemRowProps) {
  const { item } = props;

  const href = getCourseItemHref(item);

  const title = String(item.title);

  const description = String(item.description || "");

  if (!href) {
    return <CourseItemStaticRow title={title} description={description} />;
  }

  return (
    <UIListItemButton aria-label={`${title}: ${description}`} component={Link} to={href}>
      <UIListItemText primary={title} secondary={description} />
      <UIArrowForwardIcon aria-hidden="true" />
    </UIListItemButton>
  );
}
