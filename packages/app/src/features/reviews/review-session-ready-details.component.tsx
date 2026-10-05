import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ReviewTargetList } from "./review-target-list.component";
import type { ReviewSessionReadyDetailsProps } from "./review-session-ready-details-props.interface";

export function ReviewSessionReadyDetails(props: ReviewSessionReadyDetailsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="body2">
        {t("review.loadSummary", {
          due: props.viewModel.load.due,
          upcoming: props.viewModel.load.upcoming,
          suspended: props.viewModel.load.suspended,
          total: props.viewModel.load.total,
        })}
      </UITypography>
      <UITypography variant="body2">
        {t("review.retentionImpact", {
          estimated: props.viewModel.retentionImpact.estimatedReviews,
          retention: props.viewModel.retentionImpact.retentionPercent,
        })}
      </UITypography>
      <ReviewTargetList
        targets={props.viewModel.targets}
        previews={props.viewModel.previews}
        onPostpone={props.viewModel.postpone}
        onRate={props.viewModel.rate}
        onSuspend={props.viewModel.suspend}
      />
    </UIContentGroup>
  );
}
