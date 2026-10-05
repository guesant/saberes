import { UIDisclosure } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { MyStudyDailyQuestion } from "./my-study-daily-question.component";
import type { MyStudyDailyQuestionDisclosureProps } from "./my-study-daily-question-disclosure-props.interface";

export function MyStudyDailyQuestionDisclosure(props: MyStudyDailyQuestionDisclosureProps) {
  const { t } = useTranslation();

  if (!props.visible || !props.question) {
    return null;
  }

  return (
    <UIDisclosure summary={t("home.moreSuggestions")}>
      <MyStudyDailyQuestion question={props.question} />
    </UIDisclosure>
  );
}
