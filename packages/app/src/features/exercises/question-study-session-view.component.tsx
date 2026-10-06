import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAppServices } from "../../composition/use-app-services.hook";
import { QuestionStudySessionContent } from "./question-study-session-content.component";
import { QuestionStudySessionState } from "./question-study-session-state.component";

export function QuestionStudySessionView() {
  const { t } = useTranslation();

  const { sessionId } = useParams();

  const services = useAppServices();

  const session = useQuery({
    queryKey: ["study-session", sessionId],
    enabled: Boolean(sessionId),
    queryFn: async () => { return await services.progress.getSession.execute(sessionId || "") ?? null; },
  });

  if (!session.data) {
    return (
      <QuestionStudySessionState
        loading={session.isLoading}
        error={session.error}
        label={t("common.loadingQuestionSession")}
        notFoundLabel={t("exercise.sessionNotFound")}
        onRetry={async () => { await session.refetch(); }}
      />
    );
  }

  return <QuestionStudySessionContent mode={session.data.mode} sessionId={sessionId ?? ""} />;
}
