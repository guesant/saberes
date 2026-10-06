import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function QuestionBackToPracticeAction() {
  const { t } = useTranslation();

  return (
    <UIButton component={Link} to="/catalogo?modo=praticar" variant="contained">
      {t("exercise.backToPractice")}
    </UIButton>
  );
}
