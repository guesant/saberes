import { MyStudySavedLessons } from "./my-study-saved-lessons.component";
import { MyStudySavedQuestions } from "./my-study-saved-questions.component";
import type { MyStudySavedContentProps } from "./my-study-saved-content-props.type";

export function MyStudySavedContent(props: MyStudySavedContentProps) {
  return (
    <>
      {props.lessons.length ? <MyStudySavedLessons lessons={props.lessons} /> : null}
      {props.questions.length ? <MyStudySavedQuestions questions={props.questions} /> : null}
    </>
  );
}
