import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { format, isValid, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { ContentReleaseNotes } from "./content-release-notes.component";
import type { ContentReleaseReadModel } from "@guesant/saberes-application";

export interface ContentReleaseDialogContentProps {
  release: ContentReleaseReadModel;
}

export function ContentReleaseDialogContent(props: ContentReleaseDialogContentProps) {
  const { t } = useTranslation();

  const generatedAt = parseISO(props.release.generatedAt);

  return (
    <UIContentGroup variant="content">
      <UITypography>
        {t("home.contentReleaseVersion", {
          schemaVersion: props.release.schemaVersion,
          version: props.release.version,
        })}
      </UITypography>
      <UITypography color="text.secondary" variant="body2">
        {t("home.contentReleaseGeneratedAt", {
          date: isValid(generatedAt) ? format(generatedAt, "dd/MM/yyyy HH:mm") : t("home.contentReleaseDateUnavailable"),
        })}
      </UITypography>
      <UITypography color="text.secondary" variant="body2">
        {t("home.contentReleaseSource", { source: props.release.source })}
      </UITypography>
      {props.release.notes ? <ContentReleaseNotes notes={props.release.notes} /> : null}
    </UIContentGroup>
  );
}
