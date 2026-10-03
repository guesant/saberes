import { CoursePracticeChip } from "./course-practice-chip.component";
import { CourseStudyButton } from "./course-study-button.component";

export type CourseItemActionProps = {
  item: Record<string, unknown>;
};

export function CourseItemAction(props: CourseItemActionProps) {
  if (props.item.lesson_id) {
    return <CourseStudyButton lessonId={props.item.lesson_id} />;
  }

  return <CoursePracticeChip itemType={props.item.item_type} />;
}
