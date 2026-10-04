import { UITab, UITabs } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogReadModel } from "@guesant/saberes-application";

type CatalogTabsProps = {
  catalog: CatalogReadModel;
  tab: number;
  onTabChange(value: number): void;
};

export function CatalogTabs(props: CatalogTabsProps) {
  const { t } = useTranslation();

  return (
    <UITabs
      value={props.tab}
      onChange={(_, value) => props.onTabChange(value)}
      variant="scrollable"
    >
      <UITab label={`${t("catalog.courses")} ${props.catalog.courses.length}`} />

      <UITab label={`${t("catalog.maps")} ${props.catalog.maps.length}`} />

      <UITab label={`${t("catalog.plans")} ${props.catalog.plans.length}`} />

      <UITab label={`${t("catalog.contents")} ${props.catalog.content.length}`} />
    </UITabs>
  );
}
