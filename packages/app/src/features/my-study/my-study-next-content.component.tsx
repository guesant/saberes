import { UICard, UICardContent, UIChip, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudyNextContentProps = {
  course: CatalogCard | null;
};

export function MyStudyNextContent(props: MyStudyNextContentProps) {
  const { t } = useTranslation();

  const { course } = props;

  if (!course) {
    return null;
  }

  return (
    <UICard
      action={
        <Link
          aria-label={`${t("home.view")}: ${String(course.title)}`}
          to={course.href || `/cursos/${course.slug || course.id}`}
        />
      }
    >
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("home.startWithTopic")}</UITypography>
          <UITypography color="text.secondary">{course.description || t("catalog.description")}</UITypography>
          <UIChip label={course.title} />
          <UITypography color="primary" variant="button">
            {t("home.view")} →
          </UITypography>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
