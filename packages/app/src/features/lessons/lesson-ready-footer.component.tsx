import { UIButton, UIDivider } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";

export function LessonReadyFooter() {
  const { t } = useTranslation();

  return (
    <>
      <UIDivider />
      <UIButton variant="contained">{t("lesson.practice")}</UIButton>
    </>
  );
}
