import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export type MyStudyReviewReminderProps = {
  reviewCount: number;
};

export function MyStudyReviewReminder(props: MyStudyReviewReminderProps) {
  const { t } = useTranslation();

  if (!props.reviewCount) {
    return null;
  }

  return (
    <UICard action={<Link aria-label={t("home.openReviews")} to="/revisoes" />}>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("home.reviewReminderTitle")}</UITypography>
          <UITypography color="text.secondary">
            {t("home.reviewReminderDescription", { count: props.reviewCount })}
          </UITypography>
          <UITypography color="primary" variant="button">
            {t("home.openReviews")} →
          </UITypography>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
