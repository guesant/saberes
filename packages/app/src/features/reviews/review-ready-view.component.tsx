import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ReviewEmptyState } from "./review-empty-state.component";
import { ReviewRetentionDialog } from "./review-retention-dialog.component";
import { ReviewSessionReadyContent } from "./review-session-ready-content.component";
import type { ReviewViewModel } from "./review.view-model";

export type ReviewReadyViewProps = {
  viewModel: ReviewViewModel;
};

export function ReviewReadyView(props: ReviewReadyViewProps) {
  const { t } = useTranslation();

  const { viewModel } = props;

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("review.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("review.title")}</UITypography>
        <UITypography color="text.secondary">{t("review.description")}</UITypography>
      </UIContentGroup>
      <ReviewRetentionDialog
        onChange={props.viewModel.setRetention}
        retention={props.viewModel.retention}
        title={t("review.customizeRetention")}
        triggerLabel={t("review.customizeRetention")}
      />
      {viewModel.targets.length ? (
        <ReviewSessionReadyContent viewModel={viewModel} />
      ) : (
        <ReviewEmptyState />
      )}
    </UIContentGroup>
  );
}
