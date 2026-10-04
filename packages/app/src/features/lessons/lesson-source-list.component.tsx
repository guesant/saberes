import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LessonSourceLinks } from "./lesson-source-links.component";
import { LessonSourcesEmpty } from "./lesson-sources-empty.component";
import type { LessonSourceListProps } from "./lesson-source-list-props.type";

export function LessonSourceList(props: LessonSourceListProps) {
  const { t } = useTranslation();

  const hasSources = props.data.sources.length > 0;

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="subtitle2">{t("lesson.sources")}</UITypography>

      {hasSources ? <LessonSourceLinks data={props.data} /> : <LessonSourcesEmpty />}
    </UIContentGroup>
  );
}
