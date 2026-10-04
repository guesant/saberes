import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { MyStudySavedQuestionItem } from "./my-study-saved-question-item.component";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudySavedQuestionsProps = {
  questions: CatalogCard[];
};

export function MyStudySavedQuestions(props: MyStudySavedQuestionsProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("home.savedQuestions")}</UITypography>
          {props.questions.map((question) => {
            return <MyStudySavedQuestionItem key={String(question.id)} question={question} />;
          })}
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
