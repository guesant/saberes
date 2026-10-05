import { UIContentGroup, UIDisclosure, UISectionAnchor } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ContentReleaseSummary } from "./content-release-summary.component";
import { LocalBackupPanel } from "./local-backup-panel.component";
import { MyStudyFirstStudyPrompt } from "./my-study-first-study-prompt.component";
import { MyStudyQuickAccessGrid } from "./my-study-quick-access-grid.component";
import { MyStudyReadyOptionalContent } from "./my-study-ready-optional-content.component";
import { MyStudySavedContent } from "./my-study-saved-content.component";
import { MyStudySessionHistory } from "./my-study-session-history.component";
import type { LocalBackupViewModel } from "./local-backup-view-model.interface";
import type { MyStudyFeatureVisibility } from "./my-study-feature-visibility.interface";
import type { MyStudyViewModel } from "./my-study.view-model";

export interface MyStudyReadySectionsProps {
  viewModel: MyStudyViewModel;
  visibility: MyStudyFeatureVisibility;
  backupViewModel: LocalBackupViewModel;
}

export function MyStudyReadySections(props: MyStudyReadySectionsProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <MyStudyFirstStudyPrompt
        course={props.viewModel.data.catalog.courses[0] || null}
        release={props.viewModel.contentRelease}
      />
      <MyStudyQuickAccessGrid />
      <UISectionAnchor id="dados-locais">
        <UIDisclosure summary={t("backup.title")}>
          <LocalBackupPanel viewModel={props.backupViewModel} />
        </UIDisclosure>
      </UISectionAnchor>
      <MyStudySavedContent
        lessons={props.viewModel.data.savedLessons}
        questions={props.viewModel.data.savedQuestions}
      />
      <MyStudySessionHistory sessions={props.viewModel.data.sessions} />
      <MyStudyReadyOptionalContent
        course={props.viewModel.data.catalog.courses[0] || null}
        dailyQuestion={props.viewModel.data.dailyQuestion}
        reviewCount={props.viewModel.data.reviews.length}
        showRecommendations={props.visibility.showRecommendations}
        showReminders={props.visibility.showReminders}
      />
      <ContentReleaseSummary
        error={props.viewModel.contentReleaseError}
        release={props.viewModel.contentRelease}
      />
    </UIContentGroup>
  );
}
