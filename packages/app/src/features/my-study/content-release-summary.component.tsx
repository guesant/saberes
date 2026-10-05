import { UIContentGroup, UIContentSurface, UIDisclosure, UITypography } from "@guesant/saberes-ui";
import { format, isValid, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { ContentErrorState } from "../../components/content-error-state.component";
import { ContentReleaseNotes } from "./content-release-notes.component";
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

  const generatedAt = parseISO(props.release.generatedAt);

  return (
    <UIContentSurface mode="outlined">
      <UIDisclosure summary={t("home.contentRelease")}>
        <UIContentGroup variant="content">
          <UITypography>
            {t("home.contentReleaseVersion", {
              schemaVersion: props.release.schemaVersion,
              version: props.release.version,
            })}
          </UITypography>
          <UITypography color="text.secondary" variant="body2">
            {t("home.contentReleaseGeneratedAt", {
              date: isValid(generatedAt)
                ? format(generatedAt, "dd/MM/yyyy HH:mm")
                : t("home.contentReleaseDateUnavailable"),
            })}
          </UITypography>
          <UITypography color="text.secondary" variant="body2">
            {t("home.contentReleaseSource", { source: props.release.source })}
          </UITypography>
          {props.release.notes ? <ContentReleaseNotes notes={props.release.notes} /> : null}
        </UIContentGroup>
      </UIDisclosure>
    </UIContentSurface>
  );
}
