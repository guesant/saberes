import { UIContentGroup } from "@guesant/saberes-ui";
import { ReviewTargetCard } from "./review-target-card.component";
import type { ReviewPreview } from "./review-preview.type";
import type { FsrsRating, ReviewTarget } from "@guesant/saberes-application";

export type ReviewTargetListProps = {
  targets: ReviewTarget[];
  previews: Record<string, ReviewPreview>;
  onPostpone(target: ReviewTarget): Promise<void>;

  onRate(target: ReviewTarget, rating: FsrsRating): Promise<void>;

  onSuspend(target: ReviewTarget): Promise<void>;
};

export function ReviewTargetList(props: ReviewTargetListProps) {
  return (
    <UIContentGroup variant="content">
      {props.targets.map((target) => {
        return (
          <ReviewTargetCard
            key={target.contentKey}
            target={target}
            preview={props.previews[target.contentKey || ""]}
            onPostpone={props.onPostpone}
            onRate={props.onRate}
            onSuspend={props.onSuspend}
          />
        );
      })}
    </UIContentGroup>
  );
}
