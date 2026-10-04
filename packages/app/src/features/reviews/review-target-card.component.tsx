import { UICard, UICardContent } from "@guesant/saberes-ui";
import { ReviewTargetCardContent } from "./review-target-card-content.component";
import type { ReviewPreview } from "./review-preview.type";
import type { FsrsRating, ReviewTarget } from "@guesant/saberes-application";

export type ReviewTargetCardProps = {
  target: ReviewTarget;
  preview: ReviewPreview | undefined;
  onPostpone: (target: ReviewTarget) => Promise<void>;
  onRate: (target: ReviewTarget, rating: FsrsRating) => Promise<void>;
  onSuspend: (target: ReviewTarget) => Promise<void>;
};

export function ReviewTargetCard(props: ReviewTargetCardProps) {
  const { target } = props;

  const questionId = String(target.contentKey).replace("question:", "");

  return (
    <UICard>
      <UICardContent>
        <ReviewTargetCardContent
          target={target}
          preview={props.preview}
          questionId={questionId}
          onPostpone={props.onPostpone}
          onRate={props.onRate}
          onSuspend={props.onSuspend}
        />
      </UICardContent>
    </UICard>
  );
}
