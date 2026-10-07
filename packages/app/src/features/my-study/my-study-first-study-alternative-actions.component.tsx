import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function MyStudyFirstStudyAlternativeActions() {
  const { t } = useTranslation();

  return (
    <UIInlineActions stacked>
      <UIButton href="/catalogo" variant="text">
        {t("home.firstStudySkip")}
      </UIButton>
      <UIButton href="/meu-estudo#dados-locais" variant="text">
        {t("home.firstStudyRestore")}
      </UIButton>
    </UIInlineActions>
  );
}
