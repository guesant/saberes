import { MyStudyDailyQuestion } from "./my-study-daily-question.component";
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
      {props.showRecommendations && props.dailyQuestion ? (
        <MyStudyDailyQuestion question={props.dailyQuestion} />
      ) : null}
    </>
  );
}
