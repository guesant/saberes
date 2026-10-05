import { ActionFeedback } from "../../components/action-feedback.component";
import type { LessonActionFeedbackProps } from "./lesson-action-feedback-props.interface";

export function LessonActionFeedback(props: LessonActionFeedbackProps) {
  return (
    <>
      <ActionFeedback error={props.bookmarkError} state={props.bookmarkState} />
      <ActionFeedback error={props.progressError} state={props.progressState} />
    </>
  );
}
