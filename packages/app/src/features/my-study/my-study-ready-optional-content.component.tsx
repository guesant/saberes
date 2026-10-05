import { MyStudyDailyQuestionDisclosure } from "./my-study-daily-question-disclosure.component";
import { MyStudyNextContent } from "./my-study-next-content.component";
import { MyStudyReviewReminder } from "./my-study-review-reminder.component";
import type { CatalogCard } from "@guesant/saberes-application";

export interface MyStudyReadyOptionalContentProps {
  course: CatalogCard | null;
  dailyQuestion: CatalogCard | null;
  reviewCount: number;
  showRecommendations: boolean;
  showReminders: boolean;
}

export function MyStudyReadyOptionalContent(props: MyStudyReadyOptionalContentProps) {
  return (
    <>
      {props.showReminders ? <MyStudyReviewReminder reviewCount={props.reviewCount} /> : null}
      {props.showRecommendations ? <MyStudyNextContent course={props.course} /> : null}
      <MyStudyDailyQuestionDisclosure
        question={props.dailyQuestion}
        visible={props.showRecommendations}
      />
    </>
  );
}
