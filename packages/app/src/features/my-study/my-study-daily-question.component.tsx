import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudyDailyQuestionProps = {
  question: CatalogCard;
};

export function MyStudyDailyQuestion(props: MyStudyDailyQuestionProps) {
  const { t } = useTranslation();

  return (
    <UICard
      action={
        <Link
          aria-label={`${t("home.solveNow")}: ${String(props.question.title)}`}
          to={`/questoes/${props.question.id}`}
        />
      }
    >
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="overline">{t("home.dailyQuestion")}</UITypography>
          <UITypography variant="h5">{props.question.title}</UITypography>
          <UITypography color="text.secondary">{t("home.dailyQuestionDescription")}</UITypography>
          <UITypography color="primary" variant="button">
            {t("home.solveNow")} →
          </UITypography>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
