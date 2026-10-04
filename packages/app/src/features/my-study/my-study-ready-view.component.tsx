import { UIContentGroup } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ContentReleaseSummary } from "./content-release-summary.component";
import { LocalBackupPanel } from "./local-backup-panel.component";
import { MyStudyCatalogError } from "./my-study-catalog-error.component";
import { MyStudyDailyQuestion } from "./my-study-daily-question.component";
import { MyStudyHeader } from "./my-study-header.component";
import { MyStudyMetricsGrid } from "./my-study-metrics-grid.component";
import { MyStudyNextContent } from "./my-study-next-content.component";
import { MyStudyProgressError } from "./my-study-progress-error.component";
import { MyStudySavedContent } from "./my-study-saved-content.component";
import { MyStudySessionHistory } from "./my-study-session-history.component";
import { useLocalBackupViewModel } from "./use-local-backup.view-model.hook";
import type { MyStudyViewModel } from "./my-study.view-model";

export type MyStudyReadyViewProps = {
  viewModel: MyStudyViewModel;
};

export function MyStudyReadyView(props: MyStudyReadyViewProps) {
  const { viewModel } = props;

  const { t } = useTranslation();

  const backupViewModel = useLocalBackupViewModel();

  return (
    <UIContentGroup variant="section">
      <MyStudyHeader />
      {viewModel.catalogError ? (
        <MyStudyCatalogError error={viewModel.catalogError} onRetry={viewModel.reload} />
      ) : null}
      {viewModel.progressError ? (
        <MyStudyProgressError
          error={viewModel.progressError}
          label={t("errors.progressLoad")}
          onRetry={viewModel.reload}
        />
      ) : null}
      <MyStudyMetricsGrid data={viewModel.data} />
      <ContentReleaseSummary
        error={viewModel.contentReleaseError}
        release={viewModel.contentRelease}
      />
      <LocalBackupPanel viewModel={backupViewModel} />
      <MyStudySavedContent
        lessons={viewModel.data.savedLessons}
        questions={viewModel.data.savedQuestions}
      />
      <MyStudySessionHistory sessions={viewModel.data.sessions} />
      <MyStudyNextContent course={viewModel.data.catalog.courses[0] || null} />
      {viewModel.data.dailyQuestion ? (
        <MyStudyDailyQuestion question={viewModel.data.dailyQuestion} />
      ) : null}
    </UIContentGroup>
  );
}
