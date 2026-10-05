import {
  UIContentGroup,
  UIDisclosure,
  UITypography,
} from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createMyStudyQuickAccessItems } from "./create-my-study-quick-access-items.function";
import { MyStudyQuickAccessItems } from "./my-study-quick-access-items.component";

export function MyStudyQuickAccessGrid() {
  const { t } = useTranslation();

  const items = createMyStudyQuickAccessItems(t);

  return (
    <UIDisclosure summary={t("home.quickAccess.more")}>
      <UIContentGroup variant="section">
        <UITypography variant="h5">{t("home.quickAccess.title")}</UITypography>

        <UITypography color="text.secondary">{t("home.quickAccess.description")}</UITypography>

        <MyStudyQuickAccessItems items={items} />
      </UIContentGroup>
    </UIDisclosure>
  );
}
