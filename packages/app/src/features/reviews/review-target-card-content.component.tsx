import {
  UIButton,
  UIChip,
  UIContentGroup,
  UIInlineActions,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { formatReviewDate } from "./format-review-date.function";
import { ReviewRatingControls } from "./review-rating-controls.component";
import type { ReviewPreview } from "./review-preview.type";
import type { FsrsRating, ReviewTarget } from "@guesant/saberes-application";

export type ReviewTargetCardContentProps = {
  target: ReviewTarget;
  preview: ReviewPreview | undefined;
  questionId: string;
  onPostpone: (target: ReviewTarget) => Promise<void>;
  onRate: (target: ReviewTarget, rating: FsrsRating) => Promise<void>;
  onSuspend: (target: ReviewTarget) => Promise<void>;
};

export function ReviewTargetCardContent(props: ReviewTargetCardContentProps) {
  const { t } = useTranslation();

  const { target } = props;

  return (
    <UIContentGroup variant="tight">
      <UIChip
        label={target.state ? t(`review.states.${target.state}`) : t("review.availableNow")}
        size="small"
      />
      <UITypography variant="h6">{target.contentKey}</UITypography>
      <UITypography color="text.secondary">
        {target.dueAt
          ? t("review.nextReview", { date: formatReviewDate(target.dueAt) })
          : t("review.availableNow")}
      </UITypography>
      <UIInlineActions wrap>
        <UIButton href={`/questoes/${props.questionId}`} variant="contained">
          {t("review.review")}
        </UIButton>
        <ReviewRatingControls target={target} preview={props.preview} onRate={props.onRate} />
        <UIButton variant="outlined" onClick={() => props.onPostpone(target)}>
          {t("review.postpone")}
        </UIButton>
        <UIButton variant="text" onClick={() => props.onSuspend(target)}>
          {t("review.suspend")}
        </UIButton>
      </UIInlineActions>
    </UIContentGroup>
  );
}
