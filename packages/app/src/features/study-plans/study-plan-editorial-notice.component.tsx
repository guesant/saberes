import { UICard, UICardContent } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function StudyPlanEditorialNotice() {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>{t("plan.editorialNotice")}</UICardContent>
    </UICard>
  );
}
