import { UIButton, UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudyDailyQuestionProps = {
  question: CatalogCard;
};

export function MyStudyDailyQuestion(props: MyStudyDailyQuestionProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="tight">
          <UITypography variant="overline">{t("home.dailyQuestion")}</UITypography>
          <UITypography variant="h5">{props.question.title}</UITypography>
          <UITypography color="text.secondary">{t("home.dailyQuestionDescription")}</UITypography>
          <UIButton href={`/questoes/${props.question.id}`} variant="contained">
            {t("home.solveNow")}
          </UIButton>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
