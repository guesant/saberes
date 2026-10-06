import { MyStudyDailyQuestion } from "./my-study-daily-question.component";
import type { MyStudyDailyQuestionDisclosureProps } from "./my-study-daily-question-disclosure-props.interface";

export function MyStudyDailyQuestionDisclosure(props: MyStudyDailyQuestionDisclosureProps) {
  if (!props.visible || !props.question) {
    return null;
  }

  return (
    <MyStudyDailyQuestion question={props.question} />
  );
}
