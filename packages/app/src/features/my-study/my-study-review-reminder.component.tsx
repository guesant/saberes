import { UIButton, UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
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
    <UICard>
      <UICardContent>
        <UIContentGroup variant="tight">
          <UITypography variant="h5">{t("home.reviewReminderTitle")}</UITypography>
          <UITypography color="text.secondary">
            {t("home.reviewReminderDescription", { count: props.reviewCount })}
          </UITypography>
          <UIButton component={Link} to="/revisoes" variant="outlined">
            {t("home.openReviews")}
          </UIButton>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
