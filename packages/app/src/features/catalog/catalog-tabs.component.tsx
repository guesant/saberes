import { Tab, Tabs } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { CatalogReadModel } from "@guesant/saberes-application";

type CatalogTabsProps = {
  catalog: CatalogReadModel;
  tab: number;
  onTabChange: (value: number) => void;
};

export function CatalogTabs(props: CatalogTabsProps) {
  const { t } = useTranslation();

  return (
    <Tabs value={props.tab} onChange={(_, value) => props.onTabChange(value)} variant="scrollable">
      <Tab label={`${t("catalog.courses")} ${props.catalog.courses.length}`} />

      <Tab label={`${t("catalog.maps")} ${props.catalog.maps.length}`} />

      <Tab label={`${t("catalog.plans")} ${props.catalog.plans.length}`} />

      <Tab label={`${t("catalog.contents")} ${props.catalog.content.length}`} />
    </Tabs>
  );
}
