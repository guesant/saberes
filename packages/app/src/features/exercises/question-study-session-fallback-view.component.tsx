import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import type { QuestionStudySessionScreenViewProps } from "./question-study-session-screen-view-props.type";
import type { QuestionStudySessionScreen } from "./question-study-session-screen.type";
import type { ReactElement } from "react";

export type QuestionStudySessionFallbackViewProps = QuestionStudySessionScreenViewProps;

export function QuestionStudySessionFallbackView(props: QuestionStudySessionFallbackViewProps) {
  const { t } = useTranslation();

  const views: Partial<Record<QuestionStudySessionScreen, ReactElement>> = {
    loading: <ContentLoadingState label={t("common.loadingQuestionSession")} />,
    error: <ContentErrorState error={props.viewModel.error} onRetry={props.viewModel.reload} />,
    "not-found": <ContentNotFoundState label={t("exercise.sessionNotFound")} />,
    "question-loading": <ContentLoadingState label={t("common.loadingQuestion")} />,
    "question-error": (
      <ContentErrorState
        error={props.viewModel.question.error}
        onRetry={props.viewModel.question.reload}
      />
    ),
    "question-not-found": <ContentNotFoundState label={t("exercise.notFound")} />,
  };

  return views[props.screen] || null;
}
