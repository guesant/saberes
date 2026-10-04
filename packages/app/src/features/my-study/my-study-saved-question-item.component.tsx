import { UIButton, UIGrowingText, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CatalogCard } from "@guesant/saberes-application";

export type MyStudySavedQuestionItemProps = {
  question: CatalogCard;
};

export function MyStudySavedQuestionItem(props: MyStudySavedQuestionItemProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIGrowingText>{props.question.title}</UIGrowingText>
      <UIButton component={Link} to={`/questoes/${props.question.id}`} size="small">
        {t("common.open")}
      </UIButton>
    </UIInlineActions>
  );
}
