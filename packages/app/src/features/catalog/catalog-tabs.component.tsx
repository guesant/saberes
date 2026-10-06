import {
  UIButtonActionIcon,
  UIResponsiveTabs,
  UITab,
} from "@guesant/saberes-ui";
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
    <UIResponsiveTabs
      onChange={(_, value) => {
        return props.onTabChange(value);
      }}
      value={props.tab}
    >
      <UITab
        icon={<UIButtonActionIcon name="unknown" />}
        iconPosition="start"
        label={`${t("catalog.courses")} · ${props.catalog.courses.length}`}
        value={0}
      />
      <UITab
        icon={<UIButtonActionIcon name="dependsOn" />}
        iconPosition="start"
        label={`${t("catalog.maps")} · ${props.catalog.maps.length}`}
        value={1}
      />
      <UITab
        icon={<UIButtonActionIcon name="checklist" />}
        iconPosition="start"
        label={`${t("catalog.plans")} · ${props.catalog.plans.length}`}
        value={2}
      />
      <UITab
        icon={<UIButtonActionIcon name="topic" />}
        iconPosition="start"
        label={`${t("catalog.contents")} · ${props.catalog.content.length}`}
        value={3}
      />
    </UIResponsiveTabs>
  );
}
