import { AssessmentLessonItemLink } from "./assessment-lesson-item-link.component";
import { AssessmentQuestionItemLink } from "./assessment-question-item-link.component";
import { AssessmentUnavailableItem } from "./assessment-unavailable-item.component";
import type { AssessmentItemLinkProps } from "./assessment-item-link-props.type";

export function AssessmentItemLink(props: AssessmentItemLinkProps) {
  const { item } = props;

  if (item.question_occurrence_id) {
    return <AssessmentQuestionItemLink item={item} />;
  }

  if (item.lesson_id) {
    return <AssessmentLessonItemLink item={item} />;
  }

  return <AssessmentUnavailableItem item={item} />;
}
