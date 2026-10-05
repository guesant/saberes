import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { LessonEditorialMetadataFacts } from "./lesson-editorial-metadata-facts.component";
import { LessonSourceList } from "./lesson-source-list.component";
import type { LessonEditorialMetadataProps } from "./lesson-editorial-metadata-props.type";

export function LessonEditorialMetadata(props: LessonEditorialMetadataProps) {
  const { t } = useTranslation();

  const { lesson } = props.data;

  return (
    <UIContentGroup variant="content">
      <UITypography variant="h5">{t("lesson.editorialMetadata")}</UITypography>

      <UITypography>{String(lesson.objective || "")}</UITypography>

      <LessonEditorialMetadataFacts data={props.data} />

      <LessonSourceList data={props.data} />
    </UIContentGroup>
  );
}
