import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function TopicPrimaryActions() {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <UIButton href="#teoria" variant="contained">{t("discovery.theory")}</UIButton>
      <UIButton href="#pratica" variant="outlined">{t("common.practice")}</UIButton>
      <UIButton href="#materiais" variant="outlined">{t("discovery.materials")}</UIButton>
    </UIInlineActions>
  );
}
