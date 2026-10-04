import { UIContentGroup, UIQuickAccessGrid, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { createMyStudyQuickAccessItems } from "./create-my-study-quick-access-items.function";
import { MyStudyQuickAccessCard } from "./my-study-quick-access-card.component";

export function MyStudyQuickAccessGrid() {
  const { t } = useTranslation();

  const items = createMyStudyQuickAccessItems(t);

  return (
    <UIContentGroup variant="section">
      <UITypography variant="h5">{t("home.quickAccess.title")}</UITypography>

      <UITypography color="text.secondary">{t("home.quickAccess.description")}</UITypography>

      <UIQuickAccessGrid>
        {items.map((item) => {
          return (
            <MyStudyQuickAccessCard
              description={item.description}
              icon={item.icon}
              key={item.to}
              title={item.title}
              to={item.to}
            />
          );
        })}
      </UIQuickAccessGrid>
    </UIContentGroup>
  );
}
