import { UIButton, UIChip, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudyCourseLinkProps = {
  course: CatalogCard;
};

export function MyStudyCourseLink(props: MyStudyCourseLinkProps) {
  const { t } = useTranslation();

  const { course } = props;

  return (
    <UIInlineActions>
      <UIChip label={course.title} />
      <UIButton href={course.href || `/cursos/${course.slug || course.id}`}>
        {t("home.view")}
      </UIButton>
    </UIInlineActions>
  );
}
