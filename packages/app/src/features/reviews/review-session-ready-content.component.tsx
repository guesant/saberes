import { UIButton, UIContentGroup, UIDialogAction } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReviewSessionReadyDetails } from "./review-session-ready-details.component";
import type { ReviewSessionReadyContentProps } from "./review-session-ready-content-props.type";

export function ReviewSessionReadyContent(props: ReviewSessionReadyContentProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleStartSession = async (): Promise<void> => {
    const sessionId = await props.viewModel.startSession();

    if (sessionId) {
      navigate(`/sessoes/questoes/${sessionId}`);
    }
  };

  return (
    <UIContentGroup variant="content">
      <UIButton iconOnly={false} variant="contained" onClick={handleStartSession}>
        {t("review.startSession")}
      </UIButton>
      <UIDialogAction label={t("review.viewQueue")} title={t("review.viewQueue")}>
        <ReviewSessionReadyDetails viewModel={props.viewModel} />
      </UIDialogAction>
    </UIContentGroup>
  );
}
