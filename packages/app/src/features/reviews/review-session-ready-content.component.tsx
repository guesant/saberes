import { UIButton, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ReviewTargetList } from "./review-target-list.component";
import type { ReviewSessionReadyContentProps } from "./review-session-ready-content-props.type";

export function ReviewSessionReadyContent(props: ReviewSessionReadyContentProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="tight">
      <UIButton variant="contained" onClick={props.viewModel.startSession}>
        {t("review.startSession")}
      </UIButton>
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
