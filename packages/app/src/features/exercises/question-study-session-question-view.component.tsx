import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentLoadingState } from "../../components/content-loading-state.component";
import { ContentNotFoundState } from "../../components/content-not-found-state.component";
import { QuestionStudySessionReadyView } from "./question-study-session-ready-view.component";
import type { QuestionStudySessionScreenViewProps } from "./question-study-session-screen-view-props.type";

export type QuestionStudySessionQuestionViewProps = QuestionStudySessionScreenViewProps;

export function QuestionStudySessionQuestionView(props: QuestionStudySessionQuestionViewProps) {
  const { t } = useTranslation();

  switch (props.screen) {
    case "question-loading":
      return <ContentLoadingState label={t("common.loadingQuestion")} />;

    case "question-error":
      return (
        <ContentErrorState
          error={props.viewModel.question.error}
          onRetry={props.viewModel.question.reload}
        />
      );

    case "question-not-found":
      return <ContentNotFoundState label={t("exercise.notFound")} />;

    default:
      return <QuestionStudySessionReadyView viewModel={props.viewModel} />;
  }
}
