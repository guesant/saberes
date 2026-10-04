import { UIButton, UIContentGroup } from "@guesant/saberes-ui";
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
