import {
  UIButton,
  UIContentGroup,
  UIInlineActions,
  UIPaper,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getFirstStudyCoursePath } from "./get-first-study-course-path.function";
import type { CatalogCard, ContentReleaseReadModel } from "@guesant/saberes-application";

export interface MyStudyFirstStudyPromptProps {
  course: CatalogCard | null;
  release: ContentReleaseReadModel | null;
}

export function MyStudyFirstStudyPrompt(props: MyStudyFirstStudyPromptProps) {
  const { t } = useTranslation();

  if (props.release?.source !== "synthetic-fixture" || !props.course) {
    return null;
  }

  const coursePath = getFirstStudyCoursePath(props.course);

  return (
    <UIPaper variant="outlined">
      <UIContentGroup variant="content">
        <UITypography variant="overline">{t("home.firstStudyEyebrow")}</UITypography>
        <UITypography variant="h3">{t("home.firstStudyTitle")}</UITypography>
        <UITypography color="text.secondary">{t("home.firstStudyDescription")}</UITypography>
        <UIInlineActions>
          <UIButton href={coursePath} variant="contained">
            {t("home.firstStudyContinue")}
          </UIButton>
          <UIButton href="/catalogo" variant="outlined">
            {t("home.firstStudyBack")}
          </UIButton>
          <UIButton href="/catalogo" variant="text">
            {t("home.firstStudySkip")}
          </UIButton>
          <UIButton href="/meu-estudo#dados-locais" variant="text">
            {t("home.firstStudyRestore")}
          </UIButton>
        </UIInlineActions>
      </UIContentGroup>
    </UIPaper>
  );
}
