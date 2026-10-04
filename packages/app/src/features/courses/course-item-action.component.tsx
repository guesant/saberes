import { CourseAssessmentButton } from "./course-assessment-button.component";
import { CoursePracticeChip } from "./course-practice-chip.component";
import { CourseStudyButton } from "./course-study-button.component";

export type CourseItemActionProps = {
  item: Record<string, unknown>;
};

export function CourseItemAction(props: CourseItemActionProps) {
  if (props.item.lesson_id) {
    return <CourseStudyButton lessonId={props.item.lesson_id} />;
  }

  if (props.item.assessment_set_id) {
    return <CourseAssessmentButton assessmentId={String(props.item.assessment_set_id)} />;
  }

  return <CoursePracticeChip itemType={props.item.item_type} />;
}
