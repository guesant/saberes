import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ReviewEmptyState } from "./review-empty-state.component";
import { ReviewTargetList } from "./review-target-list.component";
import type { ReviewViewModel } from "./review.view-model";

export type ReviewReadyViewProps = {
  viewModel: ReviewViewModel;
};

export function ReviewReadyView(props: ReviewReadyViewProps) {
  const { t } = useTranslation();

  const { viewModel } = props;

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="tight">
        <UITypography variant="overline">{t("review.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("review.title")}</UITypography>
        <UITypography color="text.secondary">{t("review.description")}</UITypography>
      </UIContentGroup>
      {viewModel.targets.length ? (
        <ReviewTargetList
          targets={viewModel.targets}
          previews={viewModel.previews}
          onPostpone={viewModel.postpone}
          onRate={viewModel.rate}
          onSuspend={viewModel.suspend}
        />
      ) : (
        <ReviewEmptyState />
      )}
    </UIContentGroup>
  );
}
