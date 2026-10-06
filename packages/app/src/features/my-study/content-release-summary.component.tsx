import { UIContentSurface, UIDialogAction } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentReleaseDialogContent } from "./content-release-dialog-content.component";
import type { ContentReleaseReadModel } from "@guesant/saberes-application";

export type ContentReleaseSummaryProps = {
  error: Error | null;
  release: ContentReleaseReadModel | null;
};

export function ContentReleaseSummary(props: ContentReleaseSummaryProps) {
  const { t } = useTranslation();

  if (props.error) {
    return <ContentErrorState error={props.error} />;
  }

  if (!props.release) {
    return null;
  }

  return (
    <UIContentSurface mode="outlined">
      <UIDialogAction label={t("home.contentRelease")} title={t("home.contentRelease")}>
        <ContentReleaseDialogContent release={props.release} />
      </UIDialogAction>
    </UIContentSurface>
  );
}
