import { UIChip, UISplitContentRow } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { LessonEditorialMetadataFactsProps } from "./lesson-editorial-metadata-facts-props.type";

export function LessonEditorialMetadataFacts(props: LessonEditorialMetadataFactsProps) {
  const { t } = useTranslation();

  const { lesson } = props.data;

  return (
    <UISplitContentRow>
      <UIChip label={t("lesson.level", { value: String(lesson.level || "") })} />

      <UIChip label={t("lesson.duration", { value: String(lesson.estimated_minutes || "") })} />

      <UIChip
        label={t("lesson.editorialVersion", {
          value: String(lesson.editorial_version || ""),
        })}
      />

      <UIChip label={t("lesson.reviewStatus", { value: String(lesson.review_status || "") })} />
    </UISplitContentRow>
  );
}
