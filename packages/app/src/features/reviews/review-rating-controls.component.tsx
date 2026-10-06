import { FsrsRating, type ReviewTarget } from "@guesant/saberes-application";
import { UIChoiceButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { formatReviewDate } from "./format-review-date.function";
import type { ReviewPreview } from "./review-preview.type";

export type ReviewRatingControlsProps = {
  target: ReviewTarget;
  preview: ReviewPreview | undefined;
  onRate(target: ReviewTarget, rating: FsrsRating): Promise<void>;
};

export function ReviewRatingControls(props: ReviewRatingControlsProps) {
  const { t } = useTranslation();

  const getDueLabel = (rating: FsrsRating): string => {
    const dueAt = props.preview?.[rating]?.dueAt;

    return dueAt ? formatReviewDate(dueAt) : t("review.nextReviewUnknown");
  };

  return (
    <UIInlineActions wrap>
      <UIChoiceButton
        variant="outlined"
        onClick={() => { return props.onRate(props.target, FsrsRating.Again); }}
      >
        {t("review.again")} · {getDueLabel(FsrsRating.Again)}
      </UIChoiceButton>
      <UIChoiceButton
        variant="outlined"
        onClick={() => { return props.onRate(props.target, FsrsRating.Hard); }}
      >
        {t("review.hard")} · {getDueLabel(FsrsRating.Hard)}
      </UIChoiceButton>
      <UIChoiceButton
        variant="outlined"
        onClick={() => { return props.onRate(props.target, FsrsRating.Good); }}
      >
        {t("review.good")} · {getDueLabel(FsrsRating.Good)}
      </UIChoiceButton>
      <UIChoiceButton
        variant="outlined"
        onClick={() => { return props.onRate(props.target, FsrsRating.Easy); }}
      >
        {t("review.easy")} · {getDueLabel(FsrsRating.Easy)}
      </UIChoiceButton>
    </UIInlineActions>
  );
}
