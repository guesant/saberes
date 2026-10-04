import { UIButton, UIGrowingText, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudySavedLessonItemProps = {
  lesson: CatalogCard;
};

export function MyStudySavedLessonItem(props: MyStudySavedLessonItemProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIGrowingText>{props.lesson.title}</UIGrowingText>
      <UIButton component={Link} to={`/licoes/${props.lesson.id}`} size="small">
        {t("common.open")}
      </UIButton>
    </UIInlineActions>
  );
}
